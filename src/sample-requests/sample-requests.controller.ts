import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SampleRequestsService, CreateSampleRequestDto, UpdateSampleRequestDto } from './sample-requests.service';

@Controller('sample-requests')
export class SampleRequestsController {
  constructor(private readonly sampleRequestsService: SampleRequestsService) {}

  @Post()
  async create(@Body() createDto: CreateSampleRequestDto, @Req() req: any) {
    console.log('[SampleRequest] Creating sample request:', createDto);
    
    // Use userId from body (fallback mechanism if token is invalid)
    // If JWT auth succeeds, req.user.id is available, otherwise use body userId
    const userId = req.user?.id || createDto.userId;
    
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    
    // Ensure userId is set
    createDto.userId = userId;
    
    const result = await this.sampleRequestsService.create(createDto);
    console.log('[SampleRequest] Created sample request:', result);
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Keep JWT for GET endpoints
  async findAll(@Query('clientId') clientId?: string, @Query('status') status?: string) {
    if (clientId) {
      return this.sampleRequestsService.findByClient(parseInt(clientId));
    }
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      return this.sampleRequestsService.findByStatus(status as 'pending' | 'approved' | 'rejected');
    }
    
    return this.sampleRequestsService.findAll();
  }

  @Get('my-requests')
  @UseGuards(JwtAuthGuard) // Keep JWT for GET endpoints
  async findMyRequests(@Req() req: any) {
    return this.sampleRequestsService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Keep JWT for GET endpoints
  async findOne(@Param('id') id: string) {
    return this.sampleRequestsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // Keep JWT for PATCH/DELETE endpoints
  async update(@Param('id') id: string, @Body() updateDto: UpdateSampleRequestDto, @Req() req: any) {
    // Ensure approvedBy is set to current user if approving
    if (updateDto.status === 'approved' && !updateDto.approvedBy) {
      updateDto.approvedBy = req.user.id;
    }
    
    return this.sampleRequestsService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Keep JWT for PATCH/DELETE endpoints
  async remove(@Param('id') id: string) {
    return this.sampleRequestsService.remove(+id);
  }
}
