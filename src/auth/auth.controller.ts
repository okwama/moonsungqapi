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
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginDto.phoneNumber, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      return await this.authService.login(user);
    } catch (error) {
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

  // Removed getValidTokens endpoint since we're not storing tokens in database anymore

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