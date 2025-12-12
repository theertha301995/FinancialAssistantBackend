import express from 'express';
import { setBudget, getBudgetStatus, updateBudget, deleteBudget } from '../controller/budgetController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, setBudget);
router.get('/', protect, getBudgetStatus);
router.put('/:id', protect, updateBudget);
router.delete('/:id', protect, deleteBudget);

export default router;