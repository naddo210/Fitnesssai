import mongoose from 'mongoose';

const nutritionLogSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String, // Format YYYY-MM-DD
        required: true,
    },
    calories: {
        type: Number,
        default: 0,
    },
    protein: {
        type: Number, // in grams
        default: 0,
    },
    water: {
        type: Number, // number of glasses/units
        default: 0,
    }
}, {
    timestamps: true
});

// Ensure only one log per user per day
nutritionLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);

export default NutritionLog;
