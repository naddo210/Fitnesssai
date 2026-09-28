import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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
        const { name, email, password, fitnessLevel } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            fitnessLevel: fitnessLevel || 'Beginner'
        });

        if (user) {
            const token = generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                fitnessLevel: user.fitnessLevel,
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
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                fitnessLevel: user.fitnessLevel,
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
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        fitnessLevel: req.user.fitnessLevel,
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
