import NutritionLog from '../models/NutritionLog.js';

// @desc    Get nutrition log for specific date (defaults to today)
// @route   GET /api/nutrition?date=YYYY-MM-DD
// @access  Private
const getDailyLog = async (req, res) => {
    try {
        const { date } = req.query;
        // Default to today in local client time usually, but for simplicity server uses passed date or assumes aligned
        // Ideally client sends date string
        const targetDate = date || new Date().toISOString().split('T')[0];

        // Find existing log or return default empty structure
        let log = await NutritionLog.findOne({
            userId: req.user._id,
            date: targetDate
        });

        if (!log) {
            // Return empty values without creating DB entry yet to save space, 
            // or return strictly what front end needs.
            return res.status(200).json({
                date: targetDate,
                calories: 0,
                protein: 0,
                water: 0
            });
        }

        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update or Create nutrition log
// @route   POST /api/nutrition
// @access  Private
const updateDailyLog = async (req, res) => {
    try {
        const { date, calories, protein, water } = req.body;

        // Validate date format if needed, but assuming client sends valid YYYY-MM-DD
        const targetDate = date || new Date().toISOString().split('T')[0];

        const log = await NutritionLog.findOneAndUpdate(
            { userId: req.user._id, date: targetDate },
            {
                $set: {
                    calories,
                    protein,
                    water
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getDailyLog, updateDailyLog };
