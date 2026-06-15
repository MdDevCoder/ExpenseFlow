import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  getInsights
} from '../controllers/analyticsController';

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/category-breakdown', protect, getCategoryBreakdown);
router.get('/monthly-trend', protect, getMonthlyTrend);
router.get('/insights', protect, getInsights);

export default router;
