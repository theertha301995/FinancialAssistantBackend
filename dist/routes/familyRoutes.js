"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const familyController_1 = require("../controller/familyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, familyController_1.createFamily);
router.post('/join', authMiddleware_1.protect, familyController_1.joinFamily); // Changed from '/add-member' to '/join'
router.get('/', authMiddleware_1.protect, familyController_1.getFamily);
router.get('/total', authMiddleware_1.protect, familyController_1.getFamilyTotalSpending);
router.get('/invite-code', authMiddleware_1.protect, familyController_1.getInviteCode); // Add this line
router.post('/regenerate-code', authMiddleware_1.protect, familyController_1.regenerateInviteCode); // Add this line
exports.default = router;
//# sourceMappingURL=familyRoutes.js.map