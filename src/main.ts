import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

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
      
      app.enableCors({
        origin: true,
        credentials: true,
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
      
      app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
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