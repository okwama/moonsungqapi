"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const compression = require("compression");
const helmet_1 = require("helmet");
const http_exception_filter_1 = require("./filters/http-exception.filter");
let app;
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
            app = await core_1.NestFactory.create(app_module_1.AppModule);
            app.use((0, helmet_1.default)({
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
                    maxAge: 31536000,
                    includeSubDomains: true,
                    preload: true,
                },
                frameguard: { action: 'deny' },
                noSniff: true,
                xssFilter: true,
            }));
            const allowedOrigins = [
                'https://glamourqueen.com',
                'https://app.glamourqueen.com',
                'https://moonsungqapi.vercel.app',
            ];
            if (process.env.NODE_ENV !== 'production') {
                allowedOrigins.push('http://localhost:3000', 'http://localhost:8080', 'http://192.168.100.14:3000', 'http://10.0.2.2:3000');
            }
            app.enableCors({
                origin: (origin, callback) => {
                    if (!origin)
                        return callback(null, true);
                    if (allowedOrigins.indexOf(origin) !== -1) {
                        callback(null, true);
                    }
                    else {
                        console.warn(`⚠️ CORS blocked origin: ${origin}`);
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
                exposedHeaders: ['Authorization'],
                maxAge: 3600,
            });
            if (!process.env.VERCEL) {
                app.use(compression({
                    level: 6,
                    threshold: 1024,
                    filter: (req, res) => {
                        if (req.headers['x-no-compression']) {
                            return false;
                        }
                        return compression.filter(req, res);
                    }
                }));
            }
            app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
            app.useGlobalPipes(new common_1.ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }));
            app.setGlobalPrefix('api');
            await app.init();
            console.log('✅ NestJS application initialized successfully');
        }
        return app;
    }
    catch (error) {
        console.error('❌ Failed to start NestJS application:', error);
        throw error;
    }
}
async function handler(req, res) {
    try {
        process.env.VERCEL = 'true';
        const app = await bootstrap();
        const expressApp = app.getHttpAdapter().getInstance();
        return expressApp(req, res);
    }
    catch (error) {
        console.error('❌ Serverless function error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
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
//# sourceMappingURL=main.js.map