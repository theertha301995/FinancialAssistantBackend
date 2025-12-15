"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Get JWT secret from environment variables
 * Throws error if not configured properly
 */
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET must be set in environment variables");
    }
    return secret;
};
/**
 * Generate a JWT token for a user
 * @param id - User ID to encode in the token
 * @returns JWT token string
 */
const generateToken = (id) => {
    const secret = getJwtSecret();
    return jsonwebtoken_1.default.sign({ id }, secret, {
        expiresIn: "30d",
    });
};
exports.generateToken = generateToken;
/**
 * Verify a JWT token and return the decoded payload
 * @param token - JWT token string to verify
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
const verifyToken = (token) => {
    const secret = getJwtSecret();
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error("Token expired");
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error(`Invalid token: ${error.message}`);
        }
        throw new Error("Token verification failed");
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwtUtils.js.map