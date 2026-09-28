import Goal from '../models/Goal.js';
import Workout from '../models/Workout.js';
import WeightProgress from '../models/WeightProgress.js';

// @desc    Get Dashboard Statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Active Goals Count
        const activeGoalsCount = await Goal.countDocuments({ userId });

        // 2. Total Workouts
        const workouts = await Workout.find({ userId }).sort({ date: -1 });
        const totalWorkouts = workouts.length;

        // 3. Current Streak (Consecutive days with workouts)
        let streak = 0;
        if (workouts.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if last workout was today or yesterday to keep streak alive
            const lastWorkoutDate = new Date(workouts[0].date);
            lastWorkoutDate.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today - lastWorkoutDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                streak = 1;
                // Calculate backwards
                for (let i = 0; i < workouts.length - 1; i++) {
                    const current = new Date(workouts[i].date);
                    const next = new Date(workouts[i + 1].date);
                    current.setHours(0, 0, 0, 0);
                    next.setHours(0, 0, 0, 0);

                    const gap = (current - next) / (1000 * 60 * 60 * 24);
                    if (gap === 1) {
                        streak++;
                    } else if (gap > 1) {
                        break;
                    }
                    // if gap is 0 (same day), continue
                }
            }
        }

        // 4. Recent Activity (Last 3 workouts)
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
            recentActivity
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export { getDashboardStats };
