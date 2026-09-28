import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get Admin Metrics and Overview
// @route   GET /api/admin/stats
// @access  Private / Admin
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeStreaks = await User.countDocuments({ currentStreak: { $gt: 0 } });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        const workoutSum = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$totalWorkouts' } } }
        ]);

        const totalWorkouts = workoutSum[0]?.total || 0;

        res.status(200).json({
            totalUsers,
            activeStreaks,
            totalWorkouts,
            totalAdmins
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error.message);
        res.status(500).json({ message: 'Failed to fetch admin statistics' });
    }
};

// @desc    Get all users (with optional search)
// @route   GET /api/admin/users
// @access  Private / Admin
export const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// @desc    Admin reset user password
// @route   PUT /api/admin/users/:id/password
// @access  Private / Admin
export const updateUserPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id } = req.params;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: `Password for ${user.email} updated successfully` });
    } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({ message: 'Failed to update user password' });
    }
};

// @desc    Update user role (user/admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private / Admin
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        if (req.user._id.toString() === id && role !== 'admin') {
            return res.status(400).json({ message: 'You cannot demote yourself from admin status' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ 
            message: `User ${user.email} role updated to ${role}`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error updating role:', error.message);
        res.status(500).json({ message: 'Failed to update user role' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private / Admin
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user._id.toString() === id) {
            return res.status(400).json({ message: 'You cannot delete your own admin account' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: `User ${user.name} (${user.email}) deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};
