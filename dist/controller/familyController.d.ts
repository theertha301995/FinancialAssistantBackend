import { Request, Response } from 'express';
export declare const createFamily: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const joinFamily: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getInviteCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const regenerateInviteCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getFamily: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getFamilyTotalSpending: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
