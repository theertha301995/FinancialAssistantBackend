import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { verifyToken } from "../utils/jwtUtils";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token received:", token?.substring(0, 20) + "..."); // Log first 20 chars
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = verifyToken(token) as { id: string };
    console.log("Decoded payload:", decoded); // See what's in the token
    
    (req as any).user = await User.findById(decoded.id).select("-password");

    if (!(req as any).user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log the actual error
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};