import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesRep } from '../entities/sales-rep.entity';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(SalesRep)
    private userRepository: Repository<SalesRep>,
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

  async validateToken(token: string): Promise<any> {
    this.logger.log('🔍 Validating JWT token');
    
    try {
      const payload = this.jwtService.verify(token);
      this.logger.log(`✅ JWT token verified for user ID: ${payload.sub}`);
      
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