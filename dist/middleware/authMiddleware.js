"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const user_1 = __importDefault(require("../models/user"));
const jwtUtils_1 = require("../utils/jwtUtils");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        console.log("Token received:", token?.substring(0, 20) + "..."); // Log first 20 chars
    }
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
    try {
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        console.log("Decoded payload:", decoded); // See what's in the token
        req.user = await user_1.default.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }
        next();
    }
    catch (error) {
        console.error("Token verification error:", error); // Log the actual error
        return res.status(401).json({ message: "Not authorized, token invalid" });
    }
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map