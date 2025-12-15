import { createLogger, format, transports } from "winston";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

// Use /tmp for logs in Docker (always writable)
const logsDir = process.env.LOG_DIR || '/tmp/logs';

// Try to create logs directory, but don't crash if it fails
let fileLoggingEnabled = false;
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  // Test if we can write to it
  fs.accessSync(logsDir, fs.constants.W_OK);
  fileLoggingEnabled = true;
  console.log(`✅ File logging enabled: ${logsDir}`);
} catch (error) {
  console.warn('⚠️  Cannot create logs directory, using console-only logging');
  fileLoggingEnabled = false;
}

// Custom format for better readability
const customFormat = format.printf(({ level, message, timestamp, service, ...metadata }) => {
  let msg = `${timestamp} [${service}] ${level}: ${message}`;
  
  // Add metadata if exists
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

// Build transports array based on what's available
const logTransports: any[] = [
  // Always include console transport
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      customFormat
    ),
  }),
];

// Only add file transports if we can write to the filesystem
if (fileLoggingEnabled) {
  logTransports.push(
    // Error logs only
    new transports.File({ 
      filename: path.join(logsDir, "error.log"), 
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // All logs
    new transports.File({ 
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

const loggerConfig: any = {
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "daily-spending-app" },
  transports: logTransports,
};

// Only add file-based exception/rejection handlers if file logging is enabled
if (fileLoggingEnabled) {
  loggerConfig.exceptionHandlers = [
    new transports.File({ filename: path.join(logsDir, "exceptions.log") }),
  ];
  loggerConfig.rejectionHandlers = [
    new transports.File({ filename: path.join(logsDir, "rejections.log") }),
  ];
}

const logger = createLogger(loggerConfig);

// If not in production, log to console with more detail
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    })
  );
}

// ============================================
// REQUEST LOGGER MIDDLEWARE
// ============================================
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
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
    } else {
      logger.info(`${req.method} ${req.originalUrl}`, logData);
    }
  });
  
  next();
};

// Stream for morgan (HTTP request logging) - alternative to requestLogger
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Helper functions for common logging patterns
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error | any, meta?: any) => {
  if (error instanceof Error) {
    logger.error(message, { 
      error: error.message, 
      stack: error.stack,
      ...meta 
    });
  } else {
    logger.error(message, { error, ...meta });
  }
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

export default logger;