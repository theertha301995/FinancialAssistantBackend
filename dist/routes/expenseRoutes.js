"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controller/expenseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, expenseController_1.addExpense);
router.get('/', authMiddleware_1.protect, expenseController_1.getExpenses);
router.get('/family', authMiddleware_1.protect, expenseController_1.getFamilyExpenses);
router.put('/:id', authMiddleware_1.protect, expenseController_1.updateExpense);
router.delete('/:id', authMiddleware_1.protect, expenseController_1.deleteExpense);
exports.default = router;
//# sourceMappingURL=expenseRoutes.js.map