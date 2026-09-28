import WeightProgress from '../models/WeightProgress.js';

// @desc    Get weight history
// @route   GET /api/progress/weight
// @access  Private
const getWeightHistory = async (req, res) => {
    const history = await WeightProgress.find({ userId: req.user._id }).sort({ date: 1 });
    res.status(200).json(history);
};

// @desc    Log weight
// @route   POST /api/progress/weight
// @access  Private
const logWeight = async (req, res) => {
    const { weight, date } = req.body;

    if (!weight) {
        res.status(400).json({ message: 'Please add weight' });
        return;
    }

    const entry = await WeightProgress.create({
        userId: req.user._id,
        weight,
        date: date || Date.now(),
    });

    res.status(200).json(entry);
};

export { getWeightHistory, logWeight };
