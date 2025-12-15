"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = exports.logWarn = exports.logError = exports.logInfo = exports.stream = exports.requestLogger = void 0;
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Use /tmp for logs in Docker (always writable)
const logsDir = process.env.LOG_DIR || '/tmp/logs';
// Try to create logs directory, but don't crash if it fails
let fileLoggingEnabled = false;
try {
    if (!fs_1.default.existsSync(logsDir)) {
        fs_1.default.mkdirSync(logsDir, { recursive: true });
    }
    // Test if we can write to it
    fs_1.default.accessSync(logsDir, fs_1.default.constants.W_OK);
    fileLoggingEnabled = true;
    console.log(`✅ File logging enabled: ${logsDir}`);
}
catch (error) {
    console.warn('⚠️  Cannot create logs directory, using console-only logging');
    fileLoggingEnabled = false;
}
// Custom format for better readability
const customFormat = winston_1.format.printf(({ level, message, timestamp, service, ...metadata }) => {
    let msg = `${timestamp} [${service}] ${level}: ${message}`;
    // Add metadata if exists
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});
// Build transports array based on what's available
const logTransports = [
    // Always include console transport
    new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat),
    }),
];
// Only add file transports if we can write to the filesystem
if (fileLoggingEnabled) {
    logTransports.push(
    // Error logs only
    new winston_1.transports.File({
        filename: path_1.default.join(logsDir, "error.log"),
        level: "error",
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }), 
    // All logs
    new winston_1.transports.File({
        filename: path_1.default.join(logsDir, "combined.log"),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }));
}
const loggerConfig = {
    level: process.env.LOG_LEVEL || "info",
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: "daily-spending-app" },
    transports: logTransports,
};
// Only add file-based exception/rejection handlers if file logging is enabled
if (fileLoggingEnabled) {
    loggerConfig.exceptionHandlers = [
        new winston_1.transports.File({ filename: path_1.default.join(logsDir, "exceptions.log") }),
    ];
    loggerConfig.rejectionHandlers = [
        new winston_1.transports.File({ filename: path_1.default.join(logsDir, "rejections.log") }),
    ];
}
const logger = (0, winston_1.createLogger)(loggerConfig);
// If not in production, log to console with more detail
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
    }));
}
// ============================================
// REQUEST LOGGER MIDDLEWARE
// ============================================
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Log when response is finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl || req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent') || 'unknown'
        };
        if (res.statusCode >= 400) {
            logger.warn(`${req.method} ${req.originalUrl}`, logData);
        }
        else {
            logger.info(`${req.method} ${req.originalUrl}`, logData);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
// Stream for morgan (HTTP request logging) - alternative to requestLogger
exports.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
// Helper functions for common logging patterns
const logInfo = (message, meta) => {
    logger.info(message, meta);
};
exports.logInfo = logInfo;
const logError = (message, error, meta) => {
    if (error instanceof Error) {
        logger.error(message, {
            error: error.message,
            stack: error.stack,
            ...meta
        });
    }
    else {
        logger.error(message, { error, ...meta });
    }
};
exports.logError = logError;
const logWarn = (message, meta) => {
    logger.warn(message, meta);
};
exports.logWarn = logWarn;
const logDebug = (message, meta) => {
    logger.debug(message, meta);
};
exports.logDebug = logDebug;
exports.default = logger;
//# sourceMappingURL=logger.js.map