/**
 * Utility for tracking daily user activity, maintaining streaks,
 * awarding gamification badges, and calculating leaderboard XP points.
 */

export const computeActiveStreak = (user) => {
    if (!user) return { activeStreak: 0, status: 'inactive' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate || user.lastWorkoutDate;
    if (!lastActive) {
        return { activeStreak: user.currentStreak || 0, status: 'inactive' };
    }

    const lastDate = new Date(lastActive);
    lastDate.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return { activeStreak: user.currentStreak || 1, status: 'active_today' };
    } else if (diffDays === 1) {
        // Active yesterday, streak is alive pending today's check-in
        return { activeStreak: user.currentStreak || 1, status: 'active_yesterday' };
    } else {
        // Missed > 1 day, streak has lapsed
        return { activeStreak: 0, status: 'lapsed' };
    }
};

export const calculateUserPoints = (user, activeStreakOverride = null) => {
    const workouts = user.totalWorkouts || 0;
    const streak = activeStreakOverride !== null ? activeStreakOverride : (user.currentStreak || 0);
    const badgesCount = (user.badges || []).length;
    const checkins = user.totalCheckins || 0;

    // 50 XP per completed workout
    // 30 XP per active daily streak day
    // 10 XP per daily check-in / app visit
    // 100 XP per unlocked achievement badge
    return (workouts * 50) + (streak * 30) + (checkins * 10) + (badgesCount * 100);
};

export const recordDailyActivity = async (user, isWorkout = false) => {
    if (!user) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    let isNewDay = false;

    if (!lastActive) {
        // First recorded day of activity
        user.currentStreak = Math.max(user.currentStreak || 0, 1);
        user.totalCheckins = (user.totalCheckins || 0) + 1;
        isNewDay = true;
    } else {
        const diffMs = today.getTime() - lastActive.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day: streak increases!
            user.currentStreak = (user.currentStreak || 0) + 1;
            user.totalCheckins = (user.totalCheckins || 0) + 1;
            isNewDay = true;
        } else if (diffDays > 1) {
            // Missed at least 1 day: reset streak to 1 for today
            user.currentStreak = 1;
            user.totalCheckins = (user.totalCheckins || 0) + 1;
            isNewDay = true;
        }
        // If diffDays === 0, user already came today, keep currentStreak intact
    }

    user.lastActiveDate = new Date();

    if (isWorkout) {
        user.totalWorkouts = (user.totalWorkouts || 0) + 1;
        user.lastWorkoutDate = new Date();
    }

    // Award badges
    if (!Array.isArray(user.badges)) {
        user.badges = [];
    }

    const newBadges = [];
    const checkAndAward = (badgeName) => {
        if (!user.badges.includes(badgeName)) {
            user.badges.push(badgeName);
            newBadges.push(badgeName);
        }
    };

    if (user.totalWorkouts >= 1) checkAndAward("First Steps 🥇");
    if (user.currentStreak >= 3) checkAndAward("Daily Dedicated 🌟");
    if (user.currentStreak >= 7) checkAndAward("On Fire 🔥");
    if (user.currentStreak >= 14) checkAndAward("Streak Beast ⚡");
    if (user.currentStreak >= 30) checkAndAward("Iron Will 🛡️");
    if (user.totalWorkouts >= 10) checkAndAward("Gym Rat 🏋️");
    if (user.totalWorkouts >= 50) checkAndAward("Master Athlete 🏅");
    if (user.totalWorkouts >= 100) checkAndAward("Century Club 🏆");

    // Recalculate Points / XP
    user.points = calculateUserPoints(user);

    await user.save();

    return {
        user,
        streak: user.currentStreak,
        points: user.points,
        newBadges,
        isNewDay
    };
};
