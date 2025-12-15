import { Request, Response } from 'express';
/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export declare const signup: (req: Request, res: Response) => Promise<void>;
/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export declare const login: (req: Request, res: Response) => Promise<void>;
/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export declare const getMe: (req: Request, res: Response) => Promise<void>;
