import express from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  confirmResolution,
} from '../controllers/complaintController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.post('/', upload.single('attachment'), createComplaint);
router.patch('/:id/status', adminOnly, updateComplaintStatus);
router.patch('/:id/resolution', confirmResolution);

export default router;
