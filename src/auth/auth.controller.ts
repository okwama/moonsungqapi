import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
//  import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Explicitly return 200 status code
  async login(@Body() loginDto: LoginDto) {
    this.logger.log('🔐 Login attempt received');
    this.logger.log(`📱 Phone Number: ${loginDto.phoneNumber}`);
    this.logger.log(`🔑 Password: ${loginDto.password ? '[PROVIDED]' : '[MISSING]'}`);
    this.logger.log(`📦 Full payload: ${JSON.stringify(loginDto, null, 2)}`);
    
    try {
      const user = await this.authService.validateUser(loginDto.phoneNumber, loginDto.password);
      if (!user) {
        this.logger.warn(`❌ Login failed for phone: ${loginDto.phoneNumber} - Invalid credentials`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      this.logger.log(`✅ Login successful for user: ${user.name} (ID: ${user.id})`);
      const result = await this.authService.login(user);
      this.logger.log(`🎫 JWT token generated for user: ${user.name}`);
      
      // Return 200 status code instead of 201
      return result;
    } catch (error) {
      this.logger.error(`💥 Login error for phone: ${loginDto.phoneNumber}`, error.stack);
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.log('🔄 Token refresh request received');
    this.logger.log(`📦 Refresh token: ${refreshTokenDto.refreshToken ? '[PROVIDED]' : '[MISSING]'}`);
    
    try {
      const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
      this.logger.log('✅ Token refresh successful');
      
      return result;
    } catch (error) {
      this.logger.error('💥 Token refresh failed', error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    this.logger.log(`👤 Profile request for user: ${req.user?.name || 'Unknown'}`);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    this.logger.log(`🚪 Logout request received for user: ${req.user?.name || 'Unknown'}`);
    
    try {
      const result = await this.authService.logout(req.user.id);
      this.logger.log(`✅ Logout successful for user: ${req.user?.name}`);
      
      return result;
    } catch (error) {
      this.logger.error(`💥 Logout failed for user: ${req.user?.name}`, error.stack);
      throw error;
    }
  }
} 