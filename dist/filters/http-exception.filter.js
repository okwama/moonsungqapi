"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.message
            : 'Internal server error';
        const errorResponse = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : null;
        const errorLog = {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            statusCode: status,
            message,
            ip: request.ip,
            userAgent: request.headers['user-agent'],
        };
        if (status >= 500) {
            this.logger.error(`💥 Server Error [${status}] ${request.method} ${request.url}`, exception instanceof Error ? exception.stack : JSON.stringify(exception));
        }
        else if (status >= 400 && process.env.NODE_ENV !== 'production') {
            this.logger.warn(`⚠️ Client Error [${status}] ${request.method} ${request.url}: ${message}`);
        }
        response.status(status).json({
            statusCode: status,
            message: process.env.NODE_ENV === 'production' && status >= 500
                ? 'Internal server error'
                : message,
            error: typeof errorResponse === 'object' && errorResponse !== null
                ? errorResponse.error
                : undefined,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map