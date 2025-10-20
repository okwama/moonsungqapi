"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logApiRequest = exports.devLog = exports.AppLogger = void 0;
const common_1 = require("@nestjs/common");
class AppLogger extends common_1.Logger {
    debug(message, context) {
        if (process.env.NODE_ENV !== 'production') {
            super.debug(message, context);
        }
    }
    log(message, context) {
        if (process.env.NODE_ENV !== 'production') {
            super.log(message, context);
        }
    }
    verbose(message, context) {
        if (process.env.NODE_ENV !== 'production') {
            super.verbose(message, context);
        }
    }
    warn(message, context) {
        super.warn(message, context);
    }
    error(message, trace, context) {
        super.error(message, trace, context);
    }
}
exports.AppLogger = AppLogger;
const devLog = (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message, ...args);
    }
};
exports.devLog = devLog;
const logApiRequest = (method, url, statusCode, duration) => {
    if (process.env.NODE_ENV !== 'production') {
        const status = statusCode ? `[${statusCode}]` : '';
        const time = duration ? ` (${duration}ms)` : '';
        console.log(`🌐 ${method} ${url} ${status}${time}`);
    }
};
exports.logApiRequest = logApiRequest;
const logError = (context, error, metadata) => {
    const logger = new common_1.Logger(context);
    logger.error(typeof error === 'string' ? error : error.message, error instanceof Error ? error.stack : undefined, metadata);
};
exports.logError = logError;
//# sourceMappingURL=logger.util.js.map