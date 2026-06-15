import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { getReportData } from '../controllers/reportController';

const router = express.Router();

router.route('/').get(protect, getReportData);

export default router;
