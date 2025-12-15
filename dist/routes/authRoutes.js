"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authRouter = express_1.default.Router();
authRouter.post("/signup", authController_1.signup);
authRouter.post("/login", authController_1.login);
authRouter.get("/me", authMiddleware_1.protect, authController_1.getMe);
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map