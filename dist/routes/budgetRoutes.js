"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const budgetController_1 = require("../controller/budgetController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, budgetController_1.setBudget);
router.get('/', authMiddleware_1.protect, budgetController_1.getBudgetStatus);
router.put('/:id', authMiddleware_1.protect, budgetController_1.updateBudget);
router.delete('/:id', authMiddleware_1.protect, budgetController_1.deleteBudget);
exports.default = router;
//# sourceMappingURL=budgetRoutes.js.map