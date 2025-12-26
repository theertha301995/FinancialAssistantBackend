import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user';
import { generateToken } from '../utils/jwtUtils';
import { sendEmail } from '../utils/emailUtilities';
import { randomBytes, createHash } from 'crypto';
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
/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      res.status(400).json({ message: 'Please provide an email address' });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      res.status(200).json({ 
        message: 'If an account exists with that email, a password reset link has been sent' 
      });
      return;
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (10 minutes)
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Email message
    const message = `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n
Please click on the following link to reset your password:\n\n
${resetUrl}\n\n
This link will expire in 10 minutes.\n\n
If you did not request this, please ignore this email and your password will remain unchanged.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      res.status(200).json({ 
        message: 'If an account exists with that email, a password reset link has been sent' 
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      
      // Clear reset token fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
    }
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Validate password
    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    // Hash token to compare with stored token
    const resetPasswordToken = createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate new JWT token
    const authToken = generateToken(user._id.toString());

    res.status(200).json({
      message: 'Password reset successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: authToken,
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};