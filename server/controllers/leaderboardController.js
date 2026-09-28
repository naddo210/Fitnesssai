import User from '../models/User.js';

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Private (but could be public)
const getLeaderboard = async (req, res) => {
    try {
        // Fetch top 50 users sorted by number of badges (desc) then total workouts (desc)
        // Only return necessary fields to protect privacy
        const leaderboard = await User.find({})
            .select('name fitnessLevel badges totalWorkouts currentStreak')
            .sort({ 'badges.length': -1, totalWorkouts: -1 })
            .limit(50);

        // Calculate rank efficiently? 
        // For simple list, index + 1 on frontend is enough.

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getLeaderboard };
