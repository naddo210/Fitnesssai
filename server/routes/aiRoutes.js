import { 
    generateWorkoutPlan, 
    generateMealPlan, 
    generateExerciseGuide, 
    generateHeightGuidance, 
    getMotivation,
    generateChallengeProtocol 
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/workout-plan', generateWorkoutPlan);
router.post('/meal-plan', generateMealPlan);
router.post('/exercise', generateExerciseGuide);
router.post('/height', generateHeightGuidance);
router.post('/motivation', getMotivation);
router.post('/challenge', generateChallengeProtocol);

export default router;
