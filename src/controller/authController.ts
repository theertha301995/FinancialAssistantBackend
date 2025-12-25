import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user';
import { generateToken } from '../utils/jwtUtils';

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔥 === SIGNUP REQUEST ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Missing fields:', { name: !!name, email: !!email, password: !!password });
      res.status(400).json({ 
        message: 'Please provide name, email, and password' 
      });
      return;
    }

    console.log('✅ Validation passed');

    // Check if user exists
    console.log('🔍 Checking for existing user...');
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('❌ User already exists:', email);
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    console.log('✅ User does not exist');

    // Hash password
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('✅ Password hashed');

    // Create user
    console.log('💾 Creating user...');
    const user: IUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'member',
    });

    console.log('✅ User created:', user._id);

    // Generate token
    console.log('🎫 Generating token...');
    const token = generateToken(user._id.toString());
    console.log('✅ Token generated');

    // Send response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
    
    console.log('✅ Response sent successfully');

  } catch (error: any) {
    console.error('💥 === SIGNUP ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    // MongoDB specific errors
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    if (error.code === 11000) {
      console.error('Duplicate key:', error.keyPattern);
    }
    
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message,  // Changed from error: {}
      errorType: error.name
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Send response - NO family field, but include hasFamily flag
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      hasFamily: !!user.family, // Just a boolean to know if setup is needed
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Return user info without exposing family ID
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasFamily: !!user.family,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};