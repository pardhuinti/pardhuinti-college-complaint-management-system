import express from 'express';
import {
  getAdminStats,
  getRegisteredStudents,
  updateStudentAccountStatus,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/students', getRegisteredStudents);
router.patch('/students/:id/status', updateStudentAccountStatus);

export default router;
