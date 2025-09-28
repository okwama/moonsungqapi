import { Controller, Get, Query } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // GET /pricing/outlet-effective?clientId=...&productId=...&asOf=YYYY-MM-DD
  @Get('outlet-effective')
  async getOutletEffective(
    @Query('clientId') clientId: string,
    @Query('productId') productId: string,
    @Query('asOf') asOf?: string,
  ) {
    const cid = parseInt(clientId);
    const pid = parseInt(productId);
    const asOfDate = asOf ? new Date(asOf) : undefined;
    return this.pricingService.getOutletEffectivePrice({ clientId: cid, productId: pid, asOf: asOfDate });
  }
}


