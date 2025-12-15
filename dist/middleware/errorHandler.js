"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    // Log error details
    logger_1.default.error(err.message, { stack: err.stack });
    // Send safe response
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map