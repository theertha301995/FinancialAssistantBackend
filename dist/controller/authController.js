"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const jwtUtils_1 = require("../utils/jwtUtils");
/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const userExists = await user_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user without family
        const user = await user_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: 'member',
        });
        // Generate token
        const token = (0, jwtUtils_1.generateToken)(user._id.toString());
        // Send response - NO family field
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};
exports.signup = signup;
/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate token
        const token = (0, jwtUtils_1.generateToken)(user._id.toString());
        // Send response - NO family field, but include hasFamily flag
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            hasFamily: !!user.family, // Just a boolean to know if setup is needed
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};
exports.login = login;
/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        const user = await user_1.default.findById(req.user._id).select('-password');
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map