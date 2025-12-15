import { JwtPayload } from "jsonwebtoken";
/**
 * Generate a JWT token for a user
 * @param id - User ID to encode in the token
 * @returns JWT token string
 */
export declare const generateToken: (id: string) => string;
/**
 * Verify a JWT token and return the decoded payload
 * @param token - JWT token string to verify
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export declare const verifyToken: (token: string) => JwtPayload | string;
