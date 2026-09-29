import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { recordDailyActivity } from '../utils/activityTracker.js';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'gymgenius_secret_key_123', {
        expiresIn: '30d',
    });

    // Cross-origin friendly cookie options (Render HTTPS <-> Vercel/Localhost)
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Always true for cross-origin HTTPS
        sameSite: 'none', // Required for cross-domain API communication
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return token;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, fitnessLevel, adminCode } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
        }

        const isAdminCode = adminCode && (adminCode === (process.env.ADMIN_CODE || 'GYM_GENIUS_ADMIN_2026'));
        const userCount = await User.countDocuments();
        const role = (isAdminCode || userCount === 0 || normalizedEmail.startsWith('admin@')) ? 'admin' : 'user';

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            fitnessLevel: fitnessLevel || 'Beginner',
            role
        });

        if (user) {
            const token = generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                fitnessLevel: user.fitnessLevel,
                role: user.role,
                token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id);
            // Record daily visit and maintain streak
            await recordDailyActivity(user, false);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                fitnessLevel: user.fitnessLevel,
                role: user.role || 'user',
                currentStreak: user.currentStreak || 1,
                points: user.points || 0,
                badges: user.badges || [],
                totalWorkouts: user.totalWorkouts || 0,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    const userDoc = await User.findById(req.user._id);
    if (userDoc) {
        await recordDailyActivity(userDoc, false);
    }
    const target = userDoc || req.user;
    const user = {
        _id: target._id,
        name: target.name,
        email: target.email,
        fitnessLevel: target.fitnessLevel,
        role: target.role || 'user',
        currentStreak: target.currentStreak || 1,
        points: target.points || 0,
        badges: target.badges || [],
        totalWorkouts: target.totalWorkouts || 0,
    };
    res.status(200).json(user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.fitnessLevel = req.body.fitnessLevel || user.fitnessLevel;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            const token = generateToken(res, updatedUser._id);

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                fitnessLevel: updatedUser.fitnessLevel,
                role: updatedUser.role || 'user',
                token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile };
