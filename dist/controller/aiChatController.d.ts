import { Request, Response, NextFunction } from "express";
interface AuthRequest extends Request {
    user?: {
        id: string;
        family: string;
        email?: string;
        name?: string;
    };
}
/**
 * Log expense using natural language - 100% FREE with Multilingual Support
 */
export declare const logExpenseByChat: (req: AuthRequest, res: Response, next?: NextFunction) => Promise<void | Response>;
/**
 * Chat about expenses - Simple responses with multilingual support
 */
export declare const chatAboutExpenses: (req: AuthRequest, res: Response) => Promise<void | Response>;
export {};
