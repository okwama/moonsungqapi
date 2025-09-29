"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const compression = require("compression");
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
            app.enableCors({
                origin: true,
                credentials: true,
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
            app.useGlobalPipes(new common_1.ValidationPipe({
                transform: true,
                whitelist: true,
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