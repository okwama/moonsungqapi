import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PricingService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getOutletEffectivePrice(params: { clientId: number; productId: number; asOf?: Date }) {
    const asOfDate = params.asOf ? params.asOf : new Date();
    const dateStr = asOfDate.toISOString().slice(0, 10);
    const result = await this.dataSource.query(
      'CALL sp_get_effective_price_outlet_offer(?, ?, ?)',
      [params.clientId, params.productId, dateStr],
    );
    // MySQL returns [rows, metadata]; with CALL, often [[row], metadata]
    const rows = Array.isArray(result) ? result[0] : result;
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }
}


