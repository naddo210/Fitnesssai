import express from 'express';
import { getWeightHistory, logWeight } from '../controllers/weightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getWeightHistory).post(logWeight);

export default router;
