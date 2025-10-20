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
    // Optimized query: only select necessary fields and include role in one query
    const user = await this.userRepository.findOne({
      where: { phoneNumber, status: 1 }, // Filter by status in query
      relations: ['role'],
      select: ['id', 'name', 'phoneNumber', 'email', 'password', 'status', 'roleId', 'countryId', 'region_id', 'route_id', 'photoUrl']
    });
    
    if (!user) {
      return null; // User not found or inactive
    }
    
    // Validate password
    const isValidPassword = await user.validatePassword(password);
    
    if (isValidPassword) {
      const { password: _, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { 
      phoneNumber: user.phoneNumber, 
      sub: user.id,
      role: user.role?.name || 'USER',
      roleId: user.roleId,
      countryId: user.countryId,
      regionId: user.region_id,
      routeId: user.route_id
    };
    
    // Generate tokens without database storage
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    return {
      success: true,
      message: 'Login successful',
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: 32400, // 9 hours in seconds
      salesRep: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,  // Keep for backward compatibility
        phoneNumber: user.phoneNumber,  // ✅ FIX: Add phoneNumber to match profile endpoint
        role: user.role?.name || 'USER',
        roleId: user.roleId,
        countryId: user.countryId,
        regionId: user.region_id,
        routeId: user.route_id,
        status: user.status,
        photoUrl: user.photoUrl
      }
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      // Generate new access token
      const newAccessToken = this.jwtService.sign({
        phoneNumber: payload.phoneNumber,
        sub: payload.sub,
        role: payload.role,
        roleId: payload.roleId,
        countryId: payload.countryId,
        regionId: payload.regionId,
        routeId: payload.routeId
      });
      
      return {
        success: true,
        accessToken: newAccessToken,
        expiresIn: 32400
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    // Since we're not storing tokens in database, logout is just client-side
    // The client should discard the tokens
    return { success: true, message: 'Logged out successfully' };
  }
}