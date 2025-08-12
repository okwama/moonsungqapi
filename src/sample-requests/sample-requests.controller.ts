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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SampleRequestsService, CreateSampleRequestDto, UpdateSampleRequestDto } from './sample-requests.service';

@Controller('sample-requests')
@UseGuards(JwtAuthGuard)
export class SampleRequestsController {
  constructor(private readonly sampleRequestsService: SampleRequestsService) {}

  @Post()
  async create(@Body() createDto: CreateSampleRequestDto, @Req() req: any) {
    console.log('[SampleRequest] Creating sample request:', createDto);
    console.log('[SampleRequest] User from request:', req.user);
    
    // Ensure the userId matches the authenticated user
    if (createDto.userId !== req.user.id) {
      createDto.userId = req.user.id;
    }
    
    const result = await this.sampleRequestsService.create(createDto);
    console.log('[SampleRequest] Created sample request:', result);
    return result;
  }

  @Get()
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
  async findMyRequests(@Req() req: any) {
    return this.sampleRequestsService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sampleRequestsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateSampleRequestDto, @Req() req: any) {
    // Ensure approvedBy is set to current user if approving
    if (updateDto.status === 'approved' && !updateDto.approvedBy) {
      updateDto.approvedBy = req.user.id;
    }
    
    return this.sampleRequestsService.update(+id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sampleRequestsService.remove(+id);
  }
}
