import User from '../models/User.js';
import { computeActiveStreak, calculateUserPoints, recordDailyActivity } from '../utils/activityTracker.js';

// @desc    Get dynamic global leaderboard
// @route   GET /api/leaderboard
// @access  Private (auth token optional/recommended)
const getLeaderboard = async (req, res) => {
    try {
        // If an authenticated user calls leaderboard, record today's activity
        if (req.user && req.user._id) {
            const currentUserDoc = await User.findById(req.user._id);
            if (currentUserDoc) {
                await recordDailyActivity(currentUserDoc, false);
            }
        }

        const sortBy = req.query.sort || 'points'; // 'points' | 'streak' | 'workouts'

        // Fetch top 100 athletes
        const rawUsers = await User.find({})
            .select('name fitnessLevel badges totalWorkouts currentStreak lastWorkoutDate lastActiveDate totalCheckins points role')
            .lean();

        // Process dynamic streak, status, and XP score for each user
        const processedUsers = rawUsers.map(user => {
            const { activeStreak, status } = computeActiveStreak(user);
            const points = calculateUserPoints(user, activeStreak);

            return {
                _id: user._id,
                name: user.name,
                fitnessLevel: user.fitnessLevel || 'Beginner',
                badges: user.badges || [],
                totalWorkouts: user.totalWorkouts || 0,
                currentStreak: activeStreak,
                streakStatus: status, // 'active_today' | 'active_yesterday' | 'lapsed'
                points,
                totalCheckins: user.totalCheckins || 0,
                lastActiveDate: user.lastActiveDate,
                isCurrentUser: req.user ? user._id.toString() === req.user._id.toString() : false,
            };
        });

        // Apply sorting based on criteria
        if (sortBy === 'streak') {
            processedUsers.sort((a, b) => b.currentStreak - a.currentStreak || b.points - a.points || b.totalWorkouts - a.totalWorkouts);
        } else if (sortBy === 'workouts') {
            processedUsers.sort((a, b) => b.totalWorkouts - a.totalWorkouts || b.points - a.points || b.currentStreak - a.currentStreak);
        } else {
            // Default: All-around Leaderboard Points (XP)
            processedUsers.sort((a, b) => b.points - a.points || b.currentStreak - a.currentStreak || b.totalWorkouts - a.totalWorkouts);
        }

        // Assign ranks
        const rankedLeaderboard = processedUsers.slice(0, 50).map((u, index) => ({
            ...u,
            rank: index + 1
        }));

        // Find current user's standing
        let currentUserSummary = null;
        if (req.user) {
            const userIndex = processedUsers.findIndex(u => u._id.toString() === req.user._id.toString());
            if (userIndex !== -1) {
                const athlete = processedUsers[userIndex];
                currentUserSummary = {
                    ...athlete,
                    rank: userIndex + 1,
                    totalAthletes: processedUsers.length
                };
            }
        }

        res.status(200).json({
            leaderboard: rankedLeaderboard,
            currentUser: currentUserSummary,
            sortBy,
            totalAthletes: processedUsers.length
        });
    } catch (error) {
        console.error('Leaderboard Fetch Error:', error.message);
        res.status(500).json({ message: error.message || 'Error fetching leaderboard' });
    }
};

export { getLeaderboard };
