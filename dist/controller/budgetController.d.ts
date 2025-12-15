import { Request, Response } from 'express';
export declare const setBudget: (req: Request, res: Response) => Promise<void>;
export declare const getBudgetStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBudget: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBudget: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
