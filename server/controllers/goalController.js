import Goal from '../models/Goal.js';

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
    const goals = await Goal.find({ userId: req.user._id });
    res.status(200).json(goals);
};

// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGoal = async (req, res) => {
    if (!req.body.title || !req.body.targetValue) {
        res.status(400).json({ message: 'Please add all required fields' });
        return;
    }

    const goal = await Goal.create({
        userId: req.user._id,
        title: req.body.title,
        currentValue: req.body.currentValue || 0,
        targetValue: req.body.targetValue,
        unit: req.body.unit,
        deadline: req.body.deadline,
    });

    res.status(200).json(goal);
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404).json({ message: 'Goal not found' });
        return;
    }

    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedGoal);
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404).json({ message: 'Goal not found' });
        return;
    }

    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await goal.deleteOne();

    res.status(200).json({ id: req.params.id });
};

export { getGoals, setGoal, updateGoal, deleteGoal };
