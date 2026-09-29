import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { recordDailyActivity } from '../utils/activityTracker.js';

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

    // --- Gamification & Daily Activity Logic ---
    const user = await User.findById(req.user._id);
    let newBadges = [];
    let userStats = { streak: 1, total: 1, points: 50 };

    if (user) {
        const activityResult = await recordDailyActivity(user, true);
        newBadges = activityResult.newBadges || [];
        userStats = {
            streak: user.currentStreak,
            total: user.totalWorkouts,
            points: user.points
        };
    }
    // ------------------------------------------

    res.status(200).json({
        workout,
        newBadges,
        userStats
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
