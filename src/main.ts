import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

let app: any;

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await app?.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await app?.close();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Define production origins
const PRODUCTION_ORIGINS = [
  'https://glamourqueen.com',
  'https://app.glamourqueen.com',
  'https://moonsungqapi.vercel.app',
  'http://157.245.105.6:3001',
];

// Define local development origins
const DEV_ORIGINS = [
  'http://localhost:3001',
  'http://localhost:8080',
  'http://localhost:52312',
  'http://192.168.100.14:52132',
  'http://10.0.2.2:3000', // Android emulator
];

async function bootstrap() {
  if (app) return app;

  console.log('Starting NestJS application...');
  app = await NestFactory.create(AppModule);

  // === Security: Helmet ===
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
          connectSrc: ["'self'", 'https://moonsungqapi.vercel.app'],
        },
      },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      frameguard: { action: 'deny' },
      noSniff: true,
      xssFilter: true,
    }),
  );

  // === CORS: Allow ALL in dev, restrict in production ===
  const isDev = process.env.NODE_ENV !== 'production';
  const allowedOrigins = isDev ? DEV_ORIGINS : PRODUCTION_ORIGINS;

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser clients (Postman, mobile, curl)
      if (!origin) return callback(null, true);

      if (isDev) {
        // Allow ALL origins in development
        return callback(null, true);
      }

      // Production: strict origin check
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    maxAge: 3600,
  });

  // === Compression (skip on Vercel) ===
  if (!process.env.VERCEL) {
    app.use(
      compression({
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
          if (req.headers['x-no-compression']) return false;
          return compression.filter(req, res);
        },
      }),
    );
  }

  // === Global Pipes & Filters ===
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // === API Prefix ===
  app.setGlobalPrefix('api');

  await app.init();
  console.log('NestJS application initialized successfully');
  return app;
}

// === Vercel Serverless Handler ===
export default async function handler(req: any, res: any) {
  try {
    process.env.VERCEL = 'true';
    const nestApp = await bootstrap();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

// === Local Development Server ===
if (process.env.NODE_ENV !== 'production') {
  bootstrap()
    .then((app) => {
      const port = process.env.PORT || 3001;
      app.listen(port, '0.0.0.0', () => {
        console.log(`Local server running on:`);
        console.log(`   Local: http://localhost:${port}`);
        console.log(`   Network: http://192.168.100.2:${port}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start application:', error);
      process.exit(1);
    });
}