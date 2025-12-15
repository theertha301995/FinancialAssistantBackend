"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controller/notificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.protect, notificationController_1.getNotifications);
router.get('/unread-count', authMiddleware_1.protect, notificationController_1.getUnreadCount);
router.put('/:id/seen', authMiddleware_1.protect, notificationController_1.markAsSeen);
router.put('/mark-all-seen', authMiddleware_1.protect, notificationController_1.markAllAsSeen);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map