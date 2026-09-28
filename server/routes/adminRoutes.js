import express from 'express';
import { 
    getAdminStats, 
    getAllUsers, 
    updateUserPassword, 
    updateUserRole, 
    deleteUser 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes in this router
router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/password', updateUserPassword);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
