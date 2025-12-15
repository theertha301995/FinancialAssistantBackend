"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsSeen = exports.markAsSeen = exports.getUnreadCount = exports.getNotifications = void 0;
const notification_1 = __importDefault(require("../models/notification"));
// @desc    Get notifications for logged-in user (typically family head)
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const familyId = req.user.family;
        const userId = req.user.id;
        console.log("Fetching notifications for family:", familyId);
        console.log("User ID:", userId);
        const notifications = await notification_1.default.find({
            family: familyId
        })
            .populate('user', 'name email')
            .sort({ date: -1 });
        console.log("Found notifications:", notifications.length);
        res.json(notifications);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};
exports.getNotifications = getNotifications;
// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await notification_1.default.countDocuments({
            recipientUser: userId,
            seen: false
        });
        res.json({ count });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching unread count', error });
    }
};
exports.getUnreadCount = getUnreadCount;
// @desc    Mark notification as seen
// @route   PUT /api/notifications/:id/seen
// @access  Private
const markAsSeen = async (req, res) => {
    try {
        const userId = req.user.id;
        const notification = await notification_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating notification', error });
    }
};
exports.markAsSeen = markAsSeen;
// @desc    Mark all notifications as seen
// @route   PUT /api/notifications/mark-all-seen
// @access  Private
const markAllAsSeen = async (req, res) => {
    try {
        const userId = req.user.id;
        await notification_1.default.updateMany({ recipientUser: userId, seen: false }, { seen: true });
        res.json({ message: 'All notifications marked as seen' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error });
    }
};
exports.markAllAsSeen = markAllAsSeen;
//# sourceMappingURL=notificationController.js.map