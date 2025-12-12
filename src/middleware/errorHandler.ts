import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details
  logger.error(err.message, { stack: err.stack });

  // Send safe response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};