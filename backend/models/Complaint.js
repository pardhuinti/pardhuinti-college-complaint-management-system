import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentInfo: {
      fullName: String,
      studentId: String,
      email: String,
      department: String,
      phoneNumber: String,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Classroom',
        'Laboratory',
        'Hostel',
        'Library',
        'Transport',
        'Electricity',
        'Water Supply',
        'Internet',
        'Cleanliness',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location details are required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Under Review',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed',
        'Reopened',
      ],
      default: 'Pending',
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    assignedTo: {
      type: String,
      default: 'Unassigned',
    },
    adminRemarks: [
      {
        remark: String,
        addedBy: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolutionFeedback: {
      accepted: Boolean,
      comment: String,
      submittedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
