import { Request, Response } from 'express';
export declare const getNotifications: (req: Request, res: Response) => Promise<void>;
export declare const getUnreadCount: (req: Request, res: Response) => Promise<void>;
export declare const markAsSeen: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markAllAsSeen: (req: Request, res: Response) => Promise<void>;
