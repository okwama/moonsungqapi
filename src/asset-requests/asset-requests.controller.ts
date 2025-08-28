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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetRequestsService, CreateAssetRequestDto, UpdateAssetRequestDto, AssignAssetsDto, ReturnAssetsDto } from './asset-requests.service';

@Controller('asset-requests')
@UseGuards(JwtAuthGuard)
export class AssetRequestsController {
  constructor(private readonly assetRequestsService: AssetRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateAssetRequestDto, @Req() req: any) {
    console.log('[AssetRequest] Creating asset request:', createDto);
    console.log('[AssetRequest] User from request:', req.user);
    
    // Ensure the salesRepId matches the authenticated user
    if (createDto.salesRepId !== req.user.id) {
      createDto.salesRepId = req.user.id;
    }
    
    const result = await this.assetRequestsService.create(createDto);
    console.log('[AssetRequest] Created asset request:', result);
    return result;
  }

  @Get()
  async findAll(@Query('userId') userId?: string, @Query('status') status?: string) {
    if (userId) {
      return this.assetRequestsService.findByUser(parseInt(userId));
    }
    
    if (status && ['pending', 'approved', 'rejected', 'assigned', 'returned'].includes(status)) {
      return this.assetRequestsService.findByStatus(status);
    }
    
    return this.assetRequestsService.findAll();
  }

  @Get('my-requests')
  async findMyRequests(@Req() req: any) {
    return this.assetRequestsService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assetRequestsService.findOne(+id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateAssetRequestDto, @Req() req: any) {
    // Ensure approvedBy/assignedBy is set to current user if approving/assigning
    if (updateDto.status === 'approved' && !updateDto.approvedBy) {
      updateDto.approvedBy = req.user.id;
    }
    
    if (updateDto.status === 'assigned' && !updateDto.assignedBy) {
      updateDto.assignedBy = req.user.id;
    }
    
    return this.assetRequestsService.update(+id, updateDto);
  }

  @Post(':id/assign')
  async assignAssets(@Param('id') id: string, @Body() assignDto: AssignAssetsDto, @Req() req: any) {
    console.log('[AssetRequest] Assigning assets to request:', id, assignDto);
    return this.assetRequestsService.assignAssets(+id, assignDto);
  }

  @Post(':id/return')
  async returnAssets(@Param('id') id: string, @Body() returnDto: ReturnAssetsDto, @Req() req: any) {
    console.log('[AssetRequest] Returning assets for request:', id, returnDto);
    return this.assetRequestsService.returnAssets(+id, returnDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.assetRequestsService.remove(+id);
  }
}

@Controller('asset-types')
@UseGuards(JwtAuthGuard)
export class AssetTypesController {
  constructor(private readonly assetRequestsService: AssetRequestsService) {}

  @Get()
  async getAssetTypes() {
    return this.assetRequestsService.getAssetTypes();
  }
}
