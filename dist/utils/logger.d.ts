import { Request, Response, NextFunction } from "express";
declare const logger: import("winston").Logger;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const stream: {
    write: (message: string) => void;
};
export declare const logInfo: (message: string, meta?: any) => void;
export declare const logError: (message: string, error?: Error | any, meta?: any) => void;
export declare const logWarn: (message: string, meta?: any) => void;
export declare const logDebug: (message: string, meta?: any) => void;
export default logger;
