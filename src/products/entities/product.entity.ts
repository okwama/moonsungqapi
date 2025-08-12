import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UpliftSaleItem } from '../../entities/uplift-sale-item.entity';
import { StoreInventory } from '../../entities/store-inventory.entity';
import { Category } from '../../entities/category.entity';
import { CategoryPriceOption } from '../../entities/category-price-option.entity';
import { SampleRequestItem } from '../../entities/sample-request-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_code', length: 20, unique: true })
  productCode: string;

  @Column({ name: 'product_name', length: 100 })
  productName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ name: 'unit_of_measure', length: 20, default: 'PCS' })
  unitOfMeasure: string;

  @Column({ 
    name: 'cost_price', 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0.00,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value) || 0
    }
  })
  costPrice: number;

  @Column({ 
    name: 'selling_price', 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0.00,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value) || 0
    }
  })
  sellingPrice: number;

  @Column({ name: 'tax_type', type: 'enum', enum: ['vat_16', 'zero_rated', 'exempted'], default: 'vat_16' })
  taxType: string;

  @Column({ name: 'reorder_level', type: 'int', default: 0, nullable: true })
  reorderLevel: number;

  @Column({ name: 'current_stock', type: 'int', default: 0, nullable: true })
  currentStock: number;

  @Column({ name: 'is_active', type: 'boolean', default: true, nullable: true })
  isActive: boolean;

  @Column({ name: 'image_url', length: 200 })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', precision: 0 })
  updatedAt: Date;

  @OneToMany(() => UpliftSaleItem, upliftSaleItem => upliftSaleItem.product)
  upliftSaleItems: UpliftSaleItem[];

  @OneToMany(() => StoreInventory, storeInventory => storeInventory.product)
  storeInventory: StoreInventory[];

  @OneToMany(() => SampleRequestItem, sampleRequestItem => sampleRequestItem.product)
  sampleRequestItems: SampleRequestItem[];

  @ManyToOne(() => Category, category => category.categoryPriceOptions)
  @JoinColumn({ name: 'category_id' })
  categoryEntity: Category;

  // Virtual property to get category price options
  get categoryPriceOptions(): CategoryPriceOption[] {
    return this.categoryEntity?.categoryPriceOptions || [];
  }

  // Stock information (calculated by backend)
  availableStock?: number;
  isOutOfStock?: boolean;
  stockSource?: string;
} 