import Goal from '../models/Goal.js';
import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { recordDailyActivity } from '../utils/activityTracker.js';

// @desc    Get Dashboard Statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Record daily activity / visit
        let userDoc = await User.findById(userId);
        if (userDoc) {
            await recordDailyActivity(userDoc, false);
        }

        // 2. Active Goals Count
        const activeGoalsCount = await Goal.countDocuments({ userId });

        // 3. Total Workouts
        const workouts = await Workout.find({ userId }).sort({ date: -1 });
        const totalWorkouts = workouts.length;

        // 4. Current Streak & Points (from verified user document)
        const streak = userDoc ? (userDoc.currentStreak || 1) : 0;
        const points = userDoc ? (userDoc.points || 0) : 0;
        const badges = userDoc ? (userDoc.badges || []) : [];

        // 5. Recent Activity (Last 3 workouts)
        const recentActivity = workouts.slice(0, 3).map(w => ({
            id: w._id,
            workoutName: w.workoutName,
            date: w.date,
            duration: w.duration
        }));

        res.status(200).json({
            activeGoals: activeGoalsCount,
            totalWorkouts,
            streak,
            points,
            badges,
            recentActivity
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export { getDashboardStats };
