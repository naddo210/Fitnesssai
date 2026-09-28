import mongoose from 'mongoose';

const weightProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    weight: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const WeightProgress = mongoose.model('WeightProgress', weightProgressSchema);

export default WeightProgress;
