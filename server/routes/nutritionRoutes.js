import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDailyLog, updateDailyLog } from '../controllers/nutritionController.js';

const router = express.Router();

router.route('/')
    .get(protect, getDailyLog)
    .post(protect, updateDailyLog);

export default router;
