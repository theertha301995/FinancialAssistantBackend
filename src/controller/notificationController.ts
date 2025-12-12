import { Request, Response } from 'express';
import Notification from '../models/notification';

// @desc    Get notifications for logged-in user (typically family head)
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const familyId = (req as any).user.family;
    const userId = (req as any).user.id;
    
    console.log("Fetching notifications for family:", familyId);
    console.log("User ID:", userId);
    
    const notifications = await Notification.find({ 
      family: familyId 
    })
    .populate('user', 'name email')
    .sort({ date: -1 });
    
    console.log("Found notifications:", notifications.length);
    
    res.json(notifications);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const count = await Notification.countDocuments({ 
      recipientUser: userId,
      seen: false 
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error });
  }
};

// @desc    Mark notification as seen
// @route   PUT /api/notifications/:id/seen
// @access  Private
export const markAsSeen = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if this notification belongs to the current user
    if (notification.recipientUser.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    notification.seen = true;
    await notification.save();

    res.json({ message: 'Notification marked as seen', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error });
  }
};

// @desc    Mark all notifications as seen
// @route   PUT /api/notifications/mark-all-seen
// @access  Private
export const markAllAsSeen = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    await Notification.updateMany(
      { recipientUser: userId, seen: false },
      { seen: true }
    );

    res.json({ message: 'All notifications marked as seen' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications', error });
  }
};