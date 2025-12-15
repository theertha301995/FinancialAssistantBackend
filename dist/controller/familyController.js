"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFamilyTotalSpending = exports.getFamily = exports.regenerateInviteCode = exports.getInviteCode = exports.joinFamily = exports.createFamily = void 0;
const family_1 = __importDefault(require("../models/family"));
const user_1 = __importDefault(require("../models/user"));
const expense_1 = __importDefault(require("../models/expense"));
const crypto_1 = __importDefault(require("crypto"));
// Generate unique invite code
const generateInviteCode = () => {
    return crypto_1.default.randomBytes(4).toString('hex').toUpperCase(); // e.g., "A3F7B2E1"
};
// @desc    Create a new family
// @route   POST /api/family
// @access  Private
const createFamily = async (req, res) => {
    try {
        const { name } = req.body;
        const headId = req.user.id;
        // Check if user already has a family
        const user = await user_1.default.findById(headId);
        if (user?.family) {
            return res.status(400).json({ message: 'You are already part of a family' });
        }
        const inviteCode = generateInviteCode();
        const family = await family_1.default.create({
            name,
            head: headId,
            members: [headId],
            inviteCode
        });
        await user_1.default.findByIdAndUpdate(headId, { family: family._id, role: 'head' });
        res.status(201).json({
            family,
            message: `Family created! Share this invite code: ${inviteCode}`
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating family', error });
    }
};
exports.createFamily = createFamily;
// @desc    Join family with invite code
// @route   POST /api/family/join
// @access  Private
const joinFamily = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.user.id;
        // Check if user already has a family
        const user = await user_1.default.findById(userId);
        if (user?.family) {
            return res.status(400).json({ message: 'You are already part of a family' });
        }
        // Find family by invite code
        const family = await family_1.default.findOne({ inviteCode: inviteCode.toUpperCase() });
        if (!family) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }
        // Add user to family
        family.members.push(userId);
        await family.save();
        await user_1.default.findByIdAndUpdate(userId, { family: family._id, role: 'member' });
        res.json({ message: 'Successfully joined family!', family });
    }
    catch (error) {
        res.status(500).json({ message: 'Error joining family', error });
    }
};
exports.joinFamily = joinFamily;
// @desc    Get family invite code
// @route   GET /api/family/invite-code
// @access  Private (head only)
const getInviteCode = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('User ID requesting invite code:', userId);
        const family = await family_1.default.findOne({ head: userId });
        console.log('Family found:', family);
        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }
        // Generate invite code if missing
        if (!family.inviteCode) {
            family.inviteCode = generateInviteCode();
            await family.save();
            console.log('Generated new invite code:', family.inviteCode);
        }
        const responseData = { inviteCode: family.inviteCode };
        console.log('Sending response:', responseData);
        // Make sure we're sending JSON
        return res.status(200).json(responseData);
    }
    catch (error) {
        console.error('Error fetching invite code:', error);
        return res.status(500).json({ message: 'Error fetching invite code', error });
    }
};
exports.getInviteCode = getInviteCode;
// @desc    Regenerate invite code
// @route   POST /api/family/regenerate-code
// @access  Private (head only)
const regenerateInviteCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const family = await family_1.default.findOne({ head: userId });
        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }
        family.inviteCode = generateInviteCode();
        await family.save();
        res.json({ inviteCode: family.inviteCode, message: 'Invite code regenerated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error regenerating invite code', error });
    }
};
exports.regenerateInviteCode = regenerateInviteCode;
// @desc    Get family details
// @route   GET /api/family
// @access  Private
const getFamily = async (req, res) => {
    try {
        const userId = req.user.id;
        const family = await family_1.default.findOne({ members: userId }).populate('members', '-password');
        if (!family)
            return res.status(404).json({ message: 'Family not found' });
        res.json(family);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching family details', error });
    }
};
exports.getFamily = getFamily;
// @desc    Get total family spending
// @route   GET /api/family/total
// @access  Private
const getFamilyTotalSpending = async (req, res) => {
    try {
        const userId = req.user.id;
        const family = await family_1.default.findOne({ members: userId });
        if (!family)
            return res.status(404).json({ message: 'Family not found' });
        const expenses = await expense_1.default.find({ family: family._id });
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        res.json({ familyId: family._id, total });
    }
    catch (error) {
        res.status(500).json({ message: 'Error calculating family spending', error });
    }
};
exports.getFamilyTotalSpending = getFamilyTotalSpending;
//# sourceMappingURL=familyController.js.map