import express from 'express';
import { authUser, registerUser, getUserProfile } from '../controllers/authController';
import { demoLogin } from '../controllers/demoController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/demo', demoLogin);
router.get('/profile', protect, getUserProfile);

export default router;
