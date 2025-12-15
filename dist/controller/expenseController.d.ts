import { Request, Response } from "express";
export declare const addExpense: (req: Request, res: Response) => Promise<void>;
export declare const getExpenses: (req: Request, res: Response) => Promise<void>;
export declare const getFamilyExpenses: (req: Request, res: Response) => Promise<void>;
export declare const updateExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
