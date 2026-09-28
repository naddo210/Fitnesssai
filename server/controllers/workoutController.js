import Workout from '../models/Workout.js';
import User from '../models/User.js';

// @desc    Get workouts
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(workouts);
};

// @desc    Log new workout
// @route   POST /api/workouts
// @access  Private
const logWorkout = async (req, res) => {
    const { workoutName, duration, exercises, date } = req.body;

    if (!workoutName || !duration || !exercises) {
        res.status(400).json({ message: 'Please add all required fields' });
        return;
    }

    const workout = await Workout.create({
        userId: req.user._id,
        workoutName,
        duration,
        exercises,
        date: date || Date.now(),
    });

    // --- Gamification Logic ---
    const user = await User.findById(req.user._id);

    // 1. Update Total Workouts
    user.totalWorkouts = (user.totalWorkouts || 0) + 1;

    // 2. Update Streak
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    let lastDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    if (lastDate) {
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            user.currentStreak += 1;
        } else if (diffDays > 1) {
            // Broken streak (allow logging multiple times same day without resetting)
            if (diffDays > 0) user.currentStreak = 1;
        }
    } else {
        // First workout ever
        user.currentStreak = 1;
    }

    user.lastWorkoutDate = Date.now();

    // 3. Award Badges
    const newBadges = [];

    // Badge: "First Steps" (1st workout)
    if (user.totalWorkouts === 1 && !user.badges.includes("First Steps 🥇")) {
        user.badges.push("First Steps 🥇");
        newBadges.push("First Steps 🥇");
    }

    // Badge: "On Fire" (7 day streak)
    if (user.currentStreak >= 7 && !user.badges.includes("On Fire 🔥")) {
        user.badges.push("On Fire 🔥");
        newBadges.push("On Fire 🔥");
    }

    // Badge: "Century Club" (100 workouts)
    if (user.totalWorkouts >= 100 && !user.badges.includes("Century Club 🏆")) {
        user.badges.push("Century Club 🏆");
        newBadges.push("Century Club 🏆");
    }

    await user.save();
    // --------------------------

    res.status(200).json({
        workout, newBadges, userStats: {
            streak: user.currentStreak,
            total: user.totalWorkouts
        }
    });
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
        res.status(404).json({ message: 'Workout not found' });
        return;
    }

    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    if (workout.userId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedWorkout);
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
        res.status(404).json({ message: 'Workout not found' });
        return;
    }

    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    if (workout.userId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await workout.deleteOne();

    // Optional: Decrement user stats? Leaving out for simplicity/safety unless requested.

    res.status(200).json({ id: req.params.id });
};

export { getWorkouts, logWorkout, updateWorkout, deleteWorkout };
