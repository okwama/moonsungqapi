import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notice-board')
@UseGuards(JwtAuthGuard)
export class NoticeBoardController {
  
  @Get()
  async getNotices(@Request() req) {
    // For now, return empty array since notice board functionality isn't implemented yet
    console.log(`📢 GET /notice-board - User: ${req.user?.id}, Role: ${req.user?.role}`);
    return [];
  }
}
