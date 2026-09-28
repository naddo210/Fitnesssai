import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    workoutName: {
        type: String,
        required: true,
    },
    exercises: [{
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number },
        unit: { type: String, default: 'kg' } // lbs or kg
    }],
}, {
    timestamps: true,
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
