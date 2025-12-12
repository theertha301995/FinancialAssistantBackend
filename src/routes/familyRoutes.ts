import express from 'express';
import { 
  createFamily, 
  joinFamily, 
  getFamily, 
  getFamilyTotalSpending,
  getInviteCode,        // Add this import
  regenerateInviteCode  // Add this import
} from '../controller/familyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createFamily);
router.post('/join', protect, joinFamily);  // Changed from '/add-member' to '/join'
router.get('/', protect, getFamily);
router.get('/total', protect, getFamilyTotalSpending);
router.get('/invite-code', protect, getInviteCode);           // Add this line
router.post('/regenerate-code', protect, regenerateInviteCode); // Add this line

export default router;