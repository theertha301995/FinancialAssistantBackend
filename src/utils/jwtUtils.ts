import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Get JWT secret from environment variables
 * Throws error if not configured properly
 */
const getJwtSecret = (): string => {
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
export const generateToken = (id: string): string => {
  const secret = getJwtSecret();
  
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

/**
 * Verify a JWT token and return the decoded payload
 * @param token - JWT token string to verify
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): JwtPayload | string => {
  const secret = getJwtSecret();
  
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid token: ${error.message}`);
    }
    throw new Error("Token verification failed");
  }
};