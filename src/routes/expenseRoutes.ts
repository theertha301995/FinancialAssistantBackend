import express from 'express';
import { addExpense, getExpenses, getFamilyExpenses, updateExpense, deleteExpense } from '../controller/expenseController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, addExpense);
router.get('/', protect, getExpenses);
router.get('/family', protect, getFamilyExpenses);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

export default router;