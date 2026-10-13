import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    previousStatus: {
      type: String,
      required: true,
    },
    newStatus: {
      type: String,
      required: true,
    },
    changedBy: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.StatusHistory || mongoose.model('StatusHistory', statusHistorySchema);
