import express from 'express';
import { getNotifications, markAsSeen,getUnreadCount,markAllAsSeen } from '../controller/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/:id/seen', protect, markAsSeen);
router.put('/mark-all-seen', protect, markAllAsSeen);

export default router;