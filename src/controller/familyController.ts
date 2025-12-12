import { Request, Response } from 'express';
import Family from '../models/family';
import User from '../models/user';
import Expense from '../models/expense';
import crypto from 'crypto';

// Generate unique invite code
const generateInviteCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g., "A3F7B2E1"
};

// @desc    Create a new family
// @route   POST /api/family
// @access  Private
export const createFamily = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const headId = (req as any).user.id;

    // Check if user already has a family
    const user = await User.findById(headId);
    if (user?.family) {
      return res.status(400).json({ message: 'You are already part of a family' });
    }

    const inviteCode = generateInviteCode();

    const family = await Family.create({ 
      name, 
      head: headId, 
      members: [headId],
      inviteCode 
    });

    await User.findByIdAndUpdate(headId, { family: family._id, role: 'head' });

    res.status(201).json({
      family,
      message: `Family created! Share this invite code: ${inviteCode}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating family', error });
  }
};

// @desc    Join family with invite code
// @route   POST /api/family/join
// @access  Private
export const joinFamily = async (req: Request, res: Response) => {
  try {
    const { inviteCode } = req.body;
    const userId = (req as any).user.id;

    // Check if user already has a family
    const user = await User.findById(userId);
    if (user?.family) {
      return res.status(400).json({ message: 'You are already part of a family' });
    }

    // Find family by invite code
    const family = await Family.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!family) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Add user to family
    family.members.push(userId);
    await family.save();

    await User.findByIdAndUpdate(userId, { family: family._id, role: 'member' });

    res.json({ message: 'Successfully joined family!', family });
  } catch (error) {
    res.status(500).json({ message: 'Error joining family', error });
  }
};

// @desc    Get family invite code
// @route   GET /api/family/invite-code
// @access  Private (head only)
export const getInviteCode = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    console.log('User ID requesting invite code:', userId);
    
    const family = await Family.findOne({ head: userId });
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
  } catch (error) {
    console.error('Error fetching invite code:', error);
    return res.status(500).json({ message: 'Error fetching invite code', error });
  }
};

// @desc    Regenerate invite code
// @route   POST /api/family/regenerate-code
// @access  Private (head only)
export const regenerateInviteCode = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const family = await Family.findOne({ head: userId });
    
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    family.inviteCode = generateInviteCode();
    await family.save();

    res.json({ inviteCode: family.inviteCode, message: 'Invite code regenerated' });
  } catch (error) {
    res.status(500).json({ message: 'Error regenerating invite code', error });
  }
};

// @desc    Get family details
// @route   GET /api/family
// @access  Private
export const getFamily = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const family = await Family.findOne({ members: userId }).populate('members', '-password');
    if (!family) return res.status(404).json({ message: 'Family not found' });

    res.json(family);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching family details', error });
  }
};

// @desc    Get total family spending
// @route   GET /api/family/total
// @access  Private
export const getFamilyTotalSpending = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const family = await Family.findOne({ members: userId });
    if (!family) return res.status(404).json({ message: 'Family not found' });

    const expenses = await Expense.find({ family: family._id });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({ familyId: family._id, total });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating family spending', error });
  }
};