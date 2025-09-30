import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SalesRep } from '../entities/sales-rep.entity';
import { Clients } from '../entities/clients.entity';
import { Product } from '../products/entities/product.entity';
import { JourneyPlan } from '../journey-plans/entities/journey-plan.entity';
import { LoginHistory } from '../entities/login-history.entity';
import { UpliftSale } from '../entities/uplift-sale.entity';
import { UpliftSaleItem } from '../entities/uplift-sale-item.entity';
import { Task } from '../entities/task.entity';
import { Leave } from '../entities/leave.entity';
import { Store } from '../entities/store.entity';
import { StoreInventory } from '../entities/store-inventory.entity';
import { Category } from '../entities/category.entity';
import { CategoryPriceOption } from '../entities/category-price-option.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Users } from '../users/entities/users.entity';
import { Notice } from '../notices/entities/notice.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { FeedbackReport } from '../entities/feedback-report.entity';
import { ProductReport } from '../entities/product-report.entity';
import { VisibilityReport } from '../entities/visibility-report.entity';
import { SalesClientPayment } from '../entities/sales-client-payment.entity';
import { ClientStock } from '../entities/client-stock.entity';
import { Role } from '../entities/role.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const useLocalDb = configService.get<string>('USE_LOCAL_DB', 'false') === 'true';
  const isProduction = configService.get<string>('NODE_ENV', 'development') === 'production';
  const isServerless = !!process.env.VERCEL;

  // Serverless-specific configuration
  if (isServerless) {
    console.log('☁️ Serverless environment - using optimized MySQL configuration');
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT', 3306),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [
        SalesRep, Clients, Product, JourneyPlan, LoginHistory, UpliftSale, UpliftSaleItem,
        Task, Leave, Store, StoreInventory, Category, CategoryPriceOption, Order, OrderItem, Users, Notice, LeaveType,
        FeedbackReport, ProductReport, VisibilityReport, SalesClientPayment, ClientStock, Role,
      ],
      synchronize: false,
      charset: 'utf8mb4',
      ssl: configService.get<boolean>('DB_SSL', false),
      extra: {
        // Serverless-optimized connection pool
        connectionLimit: 1, // Single connection for serverless
        acquireTimeout: 10000, // Faster timeout for serverless
        timeout: 30000, // Shorter query timeout
        reconnect: true,
        charset: 'utf8mb4',
        multipleStatements: true,
        dateStrings: true,
        // No connection pooling in serverless
        idleTimeout: 0,
        maxIdle: 0,
        minIdle: 0,
        // Disable keep-alive for serverless
        keepAliveInitialDelay: 0,
        enableKeepAlive: false,
      },
      retryAttempts: 3, // Fewer retries for serverless
      retryDelay: 1000, // Faster retry
      connectTimeout: 10000, // Faster connection timeout
      keepConnectionAlive: false, // Don't keep connections alive in serverless
      autoLoadEntities: true,
      maxQueryExecutionTime: 15000, // Shorter max query time
      logging: false, // Disable logging in serverless for performance
    };
  }

  // Force MySQL in production
  if (isProduction) {
    console.log('🚀 Production environment - using MySQL database');
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT', 3306),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [
        SalesRep, Clients, Product, JourneyPlan, LoginHistory, UpliftSale, UpliftSaleItem,
        Task, Leave, Store, StoreInventory, Category, CategoryPriceOption, Order, OrderItem, Users, Notice, LeaveType,
        FeedbackReport, ProductReport, VisibilityReport, SalesClientPayment, ClientStock, Role,
      ],
      synchronize: false,
      charset: 'utf8mb4',
      ssl: configService.get<boolean>('DB_SSL', false),
      extra: {
        // OPTIMIZED: Enhanced connection pool for better performance
        connectionLimit: 15, // Optimized pool size
        acquireTimeout: 30000, // Faster timeout for better responsiveness
        timeout: 45000, // Balanced query timeout
        reconnect: true, // Auto-reconnect on connection loss
        charset: 'utf8mb4',
        multipleStatements: true,
        dateStrings: true,
        // OPTIMIZED: Connection pool management
        idleTimeout: 180000, // 3 minutes - faster idle cleanup
        maxIdle: 8, // More idle connections for better performance
        minIdle: 3, // More minimum connections
        // OPTIMIZED: Connection validation
        validateConnection: true,
        // OPTIMIZED: Keep-alive settings
        keepAliveInitialDelay: 0,
        enableKeepAlive: true,
        // OPTIMIZED: Additional performance settings
        supportBigNumbers: true,
        bigNumberStrings: true,
        compress: true, // Enable compression for better network performance
        // OPTIMIZED: Query optimization
        queryFormat: function (query, values) {
          if (!values) return query;
          return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
              return this.escape(values[key]);
            }
            return txt;
          }.bind(this));
        },
      },
      retryAttempts: 10, // Increased retry attempts
      retryDelay: 3000, // Increased delay between retries
      connectTimeout: 60000,
      keepConnectionAlive: true,
      autoLoadEntities: true,
      // Additional connection management
      maxQueryExecutionTime: 30000, // 30 seconds max query time
      logging: configService.get<boolean>('DB_LOGGING', false) ? ['error', 'warn', 'info', 'log'] : false,
    };
  }

  // Development with MySQL
  console.log('🔧 Development environment - using MySQL database');
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [
      SalesRep, Clients, Product, JourneyPlan, LoginHistory, UpliftSale, UpliftSaleItem,
      Task, Leave, Store, StoreInventory, Category, CategoryPriceOption, Order, OrderItem, Users, Notice, LeaveType,
      FeedbackReport, ProductReport, VisibilityReport, SalesClientPayment, ClientStock, Role,
    ],
    synchronize: false,
    charset: 'utf8mb4',
    ssl: configService.get<boolean>('DB_SSL', false),
    extra: {
      connectionLimit: 10, // Reduced from 20 to prevent pool exhaustion
      acquireTimeout: 60000, // Time to wait for connection from pool
      timeout: 60000, // Query timeout
      reconnect: true, // Auto-reconnect on connection loss
      charset: 'utf8mb4',
      multipleStatements: true,
      dateStrings: true,
      // Connection pool management
      idleTimeout: 300000, // 5 minutes - close idle connections
      maxIdle: 5, // Maximum idle connections
      minIdle: 2, // Minimum idle connections to maintain
      // Connection validation
      validateConnection: true,
      // Keep-alive settings
      keepAliveInitialDelay: 0,
      enableKeepAlive: true,
    },
    retryAttempts: 10, // Increased retry attempts
    retryDelay: 3000, // Increased delay between retries
    connectTimeout: 60000,
    keepConnectionAlive: true,
    autoLoadEntities: true,
    // Additional connection management
    maxQueryExecutionTime: 30000, // 30 seconds max query time
    logging: configService.get<boolean>('DB_LOGGING', false) ? ['error', 'warn', 'info', 'log'] : false,
  };
}; 