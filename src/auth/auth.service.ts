import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesRep } from '../entities/sales-rep.entity';
import { Token } from '../entities/token.entity';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(SalesRep)
    private userRepository: Repository<SalesRep>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    this.logger.log(`🔍 Validating user with phone: ${phoneNumber}`);
    
    // First, find user without status filter to check if they exist
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
      relations: ['role']
    });
    
    if (!user) {
      this.logger.warn(`❌ User not found for phone: ${phoneNumber}`);
      return null;
    }
    
    this.logger.log(`👤 User found: ${user.name} (ID: ${user.id}, Status: ${user.status})`);
    
    if (user.status !== 1) {
      this.logger.warn(`❌ User ${user.name} is inactive (status: ${user.status})`);
      throw new UnauthorizedException('Account is inactive. Please contact admin to activate your account.');
    }
    
    const isValidPassword = await user.validatePassword(password);
    this.logger.log(`🔐 Password validation for ${user.name}: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
    
    if (isValidPassword) {
      const { password, ...result } = user;
      this.logger.log(`✅ User ${user.name} validated successfully`);
      return result;
    }
    
    this.logger.warn(`❌ Invalid password for user: ${user.name}`);
    return null;
  }

  async login(user: any) {
    this.logger.log(`🎫 Generating JWT token for user: ${user.name}`);
    
    const payload = { 
      phoneNumber: user.phoneNumber, 
      sub: user.id,
      role: user.role?.name || 'USER',
      roleId: user.roleId,
      countryId: user.countryId,
      regionId: user.region_id,
      routeId: user.route_id
    };
    
    this.logger.log(`📦 JWT payload: ${JSON.stringify(payload, null, 2)}`);
    
    const token = this.jwtService.sign(payload);
    this.logger.log(`🎫 JWT token generated successfully for user: ${user.name}`);
    
    // Generate refresh token (same as access token for now, but with longer expiry)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    this.logger.log(`🔄 Refresh token generated for user: ${user.name}`);
    
    // Store tokens in database
    await this.storeTokens(user.id, token, refreshToken);
    
    const response = {
      success: true,
      message: 'Login successful',
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: 32400, // 9 hours in seconds (matching JWT expiry)
      salesRep: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role?.name || 'USER',
        roleId: user.roleId,
        countryId: user.countryId,
        regionId: user.region_id,
        routeId: user.route_id,
        status: user.status,
        photoUrl: user.photoUrl
      }
    };
    
    this.logger.log(`📤 Login response prepared for user: ${user.name}`);
    return response;
  }

  async refreshToken(refreshToken: string) {
    this.logger.log('🔄 Processing token refresh request');
    
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);
      this.logger.log(`✅ Refresh token verified for user ID: ${payload.sub}`);
      
      // Check if refresh token exists in database and is not blacklisted
      const tokenRecord = await this.tokenRepository.findOne({
        where: {
          token: refreshToken,
          tokenType: 'refresh',
          blacklisted: false
        }
      });
      
      if (!tokenRecord) {
        this.logger.warn('❌ Refresh token not found in database or blacklisted');
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Check if token is expired
      if (new Date() > tokenRecord.expiresAt) {
        this.logger.warn('❌ Refresh token has expired');
        throw new UnauthorizedException('Refresh token expired');
      }
      
      // Get user information
      const user = await this.usersService.findById(payload.sub);
      if (!user || user.status !== 1) {
        this.logger.warn(`❌ User not found or inactive for token user ID: ${payload.sub}`);
        throw new UnauthorizedException('User not found or inactive');
      }
      
      // Generate new access token
      const newPayload = { 
        phoneNumber: user.phoneNumber, 
        sub: user.id,
        role: user.role?.name || 'USER',
        roleId: user.roleId,
        countryId: user.countryId,
        regionId: user.region_id,
        routeId: user.route_id
      };
      
      const newAccessToken = this.jwtService.sign(newPayload);
      this.logger.log(`🎫 New access token generated for user: ${user.name}`);
      
      // Store new access token
      await this.storeAccessToken(user.id, newAccessToken);
      
      // Update last used timestamp for refresh token
      await this.tokenRepository.update(
        { id: tokenRecord.id },
        { lastUsedAt: new Date() }
      );
      
      const response = {
        success: true,
        accessToken: newAccessToken,
        expiresIn: 32400, // 9 hours in seconds
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phoneNumber,
          role: user.role?.name || 'USER',
          roleId: user.roleId,
          countryId: user.countryId,
          regionId: user.region_id,
          routeId: user.route_id,
          status: user.status,
          photoUrl: user.photoUrl
        }
      };
      
      this.logger.log(`✅ Token refresh successful for user: ${user.name}`);
      return response;
      
    } catch (error) {
      this.logger.error('❌ Token refresh failed', error.stack);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    this.logger.log(`🚪 Processing logout for user ID: ${userId}`);
    
    try {
      // Blacklist all tokens for the user
      await this.tokenRepository.update(
        { salesRepId: userId },
        { blacklisted: true }
      );
      
      this.logger.log(`✅ All tokens blacklisted for user ID: ${userId}`);
      return { success: true, message: 'Logged out successfully' };
      
    } catch (error) {
      this.logger.error(`❌ Logout failed for user ID: ${userId}`, error.stack);
      throw error;
    }
  }

  private async storeTokens(userId: number, accessToken: string, refreshToken: string) {
    this.logger.log(`💾 Storing tokens for user ID: ${userId}`);
    
    try {
      // Store access token
      const accessTokenRecord = new Token();
      accessTokenRecord.token = accessToken;
      accessTokenRecord.salesRepId = userId;
      accessTokenRecord.tokenType = 'access';
      accessTokenRecord.expiresAt = new Date(Date.now() + 9 * 60 * 60 * 1000); // 9 hours
      accessTokenRecord.blacklisted = false;
      
      await this.tokenRepository.save(accessTokenRecord);
      
      // Store refresh token
      const refreshTokenRecord = new Token();
      refreshTokenRecord.token = refreshToken;
      refreshTokenRecord.salesRepId = userId;
      refreshTokenRecord.tokenType = 'refresh';
      refreshTokenRecord.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      refreshTokenRecord.blacklisted = false;
      
      await this.tokenRepository.save(refreshTokenRecord);
      
      this.logger.log(`✅ Tokens stored successfully for user ID: ${userId}`);
      
    } catch (error) {
      this.logger.error(`❌ Failed to store tokens for user ID: ${userId}`, error.stack);
      throw error;
    }
  }

  private async storeAccessToken(userId: number, accessToken: string) {
    this.logger.log(`💾 Storing new access token for user ID: ${userId}`);
    
    try {
      const accessTokenRecord = new Token();
      accessTokenRecord.token = accessToken;
      accessTokenRecord.salesRepId = userId;
      accessTokenRecord.tokenType = 'access';
      accessTokenRecord.expiresAt = new Date(Date.now() + 9 * 60 * 60 * 1000); // 9 hours
      accessTokenRecord.blacklisted = false;
      
      await this.tokenRepository.save(accessTokenRecord);
      this.logger.log(`✅ New access token stored successfully for user ID: ${userId}`);
      
    } catch (error) {
      this.logger.error(`❌ Failed to store new access token for user ID: ${userId}`, error.stack);
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    this.logger.log('🔍 Validating JWT token');
    
    try {
      const payload = this.jwtService.verify(token);
      this.logger.log(`✅ JWT token verified for user ID: ${payload.sub}`);
      
      // Check if token exists in database and is not blacklisted
      const tokenRecord = await this.tokenRepository.findOne({
        where: {
          token: token,
          tokenType: 'access',
          blacklisted: false
        }
      });
      
      if (!tokenRecord) {
        this.logger.warn('❌ Token not found in database or blacklisted');
        throw new UnauthorizedException('Invalid token');
      }
      
      // Check if token is expired
      if (new Date() > tokenRecord.expiresAt) {
        this.logger.warn('❌ Token has expired');
        throw new UnauthorizedException('Token expired');
      }
      
      const user = await this.usersService.findById(payload.sub);
      if (!user || user.status !== 1) {
        this.logger.warn(`❌ User not found or inactive for token user ID: ${payload.sub}`);
        throw new UnauthorizedException('Invalid token or user inactive');
      }
      
      this.logger.log(`✅ Token validation successful for user: ${user.name}`);
      return user;
    } catch (error) {
      this.logger.error('❌ JWT token validation failed', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }
} 