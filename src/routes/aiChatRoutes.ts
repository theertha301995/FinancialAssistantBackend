// File: src/routes/aiChatRoutes.ts - FIXED VERSION

import express, { Request, Response } from 'express';
import { logExpenseByChat } from '../controller/aiChatController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();


// ============================================
// TEST ROUTE (no auth) - for debugging
// ============================================

// ============================================
// EXPENSE ROUTE (with auth)
// ============================================
router.post('/expense', protect, logExpenseByChat);



export default router;
