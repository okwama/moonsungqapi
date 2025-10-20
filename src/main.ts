import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

let app: any;

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  if (app) {
    await app.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  if (app) {
    await app.close();
  }
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function bootstrap() {
  try {
    if (!app) {
      console.log('🚀 Starting NestJS application...');
      
      app = await NestFactory.create(AppModule);
      
      // ✅ FIX: Add helmet for security headers (CSP, XSS, HSTS, etc.)
      app.use(helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
            connectSrc: ["'self'", 'https://moonsungqapi.vercel.app'],
          },
        },
        hsts: {
          maxAge: 31536000, // 1 year
          includeSubDomains: true,
          preload: true,
        },
        frameguard: { action: 'deny' }, // Prevent clickjacking
        noSniff: true, // Prevent MIME sniffing
        xssFilter: true, // Enable XSS filter
      }));
      
      // ✅ FIX: Restrict CORS to specific origins (was: origin: true = ANY origin!)
      const allowedOrigins = [
        'https://glamourqueen.com',
        'https://app.glamourqueen.com',
        'https://moonsungqapi.vercel.app',
      ];
      
      // Add local development origins only in non-production
      if (process.env.NODE_ENV !== 'production') {
        allowedOrigins.push(
          'http://localhost:3000',
          'http://localhost:8080',
          'http://192.168.100.14:3000',
          'http://10.0.2.2:3000', // Android emulator
        );
      }
      
      app.enableCors({
        origin: (origin, callback) => {
          // Allow requests with no origin (mobile apps, Postman, curl)
          if (!origin) return callback(null, true);
          
          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            console.warn(`⚠️ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Authorization'],
        maxAge: 3600, // Cache preflight for 1 hour
      });
      
      // Add compression middleware for better performance (only for non-serverless)
      if (!process.env.VERCEL) {
        app.use(compression({
          level: 6, // Compression level (1-9, 6 is good balance)
          threshold: 1024, // Only compress responses > 1KB
          filter: (req, res) => {
            if (req.headers['x-no-compression']) {
              return false;
            }
            return compression.filter(req, res);
          }
        }));
      }
      
      // ✅ FIX: Add global exception filter
      app.useGlobalFilters(new GlobalExceptionFilter());
      
      app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true, // Reject unknown properties
        transformOptions: {
          enableImplicitConversion: true,
        },
      }));
      
      // Set global prefix for API routes
      app.setGlobalPrefix('api');
      
      await app.init();
      
      console.log('✅ NestJS application initialized successfully');
    }
    
    return app;
  } catch (error) {
    console.error('❌ Failed to start NestJS application:', error);
    throw error;
  }
}

// For Vercel serverless
export default async function handler(req: any, res: any) {
  try {
    // Set serverless environment flag
    process.env.VERCEL = 'true';
    
    const app = await bootstrap();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0', 'localhost', () => {
      console.log(`🌐 Network accessible on: http://192.168.100.2:${port}`);
    });
  }).catch((error) => {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  });
} 