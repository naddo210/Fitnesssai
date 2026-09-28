import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    currentValue: {
        type: Number,
        default: 0,
    },
    targetValue: {
        type: Number,
        required: true,
    },
    unit: {
        type: String, // e.g., 'kg', 'km', 'times'
        required: true,
    },
    deadline: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
