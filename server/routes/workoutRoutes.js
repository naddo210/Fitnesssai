import express from 'express';
import { getWorkouts, logWorkout } from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getWorkouts).post(logWorkout);

export default router;
