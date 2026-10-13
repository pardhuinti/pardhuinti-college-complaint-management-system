import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import StatusHistory from '../models/StatusHistory.js';
import User from '../models/User.js';

// @desc    Get complaints (Filtered by role, search, priority, status, category)
// @route   GET /api/complaints
export const getComplaints = async (req, res) => {
  try {
    const { search, status, priority, category } = req.query;
    let query = {};

    // Role scoping: Students see only their own complaints; Admins see all
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { complaintId: regex },
        { location: regex },
        { 'studentInfo.fullName': regex },
        { 'studentInfo.studentId': regex },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('student', 'fullName email studentId department')
      .sort({ createdAt: -1 });

    return res.json({ complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch complaints' });
  }
};

// @desc    Get single complaint detail with history
// @route   GET /api/complaints/:id
export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by _id or complaintId string
    let complaint = await Complaint.findById(id).populate('student', 'fullName email studentId department');
    if (!complaint) {
      complaint = await Complaint.findOne({ complaintId: id }).populate('student', 'fullName email studentId department');
    }

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint ticket not found' });
    }

    // Verify student ownership if user is student
    if (req.user.role === 'student' && complaint.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this complaint record' });
    }

    const history = await StatusHistory.find({ complaint: complaint._id }).sort({ createdAt: 1 });

    return res.json({ complaint, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
export const createComplaint = async (req, res) => {
  try {
    const { title, category, description, location, priority } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({ message: 'Please fill all required complaint fields' });
    }

    const complaintSeq = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CMP-2026-${complaintSeq}`;

    let attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        uploadedAt: new Date(),
      });
    }

    const studentInfo = {
      fullName: req.user.fullName,
      studentId: req.user.studentId || 'N/A',
      email: req.user.email,
      department: req.user.department || 'General',
      phoneNumber: req.user.phoneNumber || 'N/A',
    };

    const complaint = await Complaint.create({
      complaintId,
      student: req.user._id,
      studentInfo,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      priority: priority || 'Medium',
      status: 'Pending',
      attachments,
    });

    // Create initial Status History
    await StatusHistory.create({
      complaint: complaint._id,
      previousStatus: 'None',
      newStatus: 'Pending',
      changedBy: req.user.fullName,
      changedByRole: 'student',
      remark: 'Complaint registered by student',
    });

    // Notify Admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await Notification.create({
        recipient: adminUser._id,
        title: 'New Complaint Registered',
        message: `Student ${req.user.fullName} raised ticket ${complaintId}: "${title}"`,
        type: 'complaint_created',
        complaintId: complaint.complaintId,
      });
    }

    return res.status(201).json({
      message: 'Complaint submitted successfully!',
      complaint,
    });
  } catch (error) {
    console.error('Create Complaint Error:', error);
    res.status(500).json({ message: error.message || 'Failed to submit complaint' });
  }
};

// @desc    Update complaint status, assign technician, and log admin remarks
// @route   PATCH /api/complaints/:id/status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark, assignedTo, priority } = req.body;

    let complaint = await Complaint.findById(id);
    if (!complaint) {
      complaint = await Complaint.findOne({ complaintId: id });
    }

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint record not found' });
    }

    const previousStatus = complaint.status;

    if (status) complaint.status = status;
    if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
    if (priority) complaint.priority = priority;

    if (remark && remark.trim() !== '') {
      complaint.adminRemarks.push({
        remark: remark.trim(),
        addedBy: req.user.fullName || 'Admin',
        createdAt: new Date(),
      });
    }

    await complaint.save();

    // Record Status History if status changed
    if (status && status !== previousStatus) {
      await StatusHistory.create({
        complaint: complaint._id,
        previousStatus,
        newStatus: status,
        changedBy: req.user.fullName || 'Admin',
        changedByRole: 'admin',
        remark: remark || `Status updated from ${previousStatus} to ${status}`,
      });

      // Dispatch Notification to student
      await Notification.create({
        recipient: complaint.student,
        title: status === 'Resolved' ? 'Complaint Resolved! Verification Required' : `Status Updated: ${status}`,
        message: `Your complaint (${complaint.complaintId}) status is now "${status}". ${remark ? 'Admin Note: ' + remark : ''}`,
        type: status === 'Resolved' ? 'resolution_requested' : 'status_update',
        complaintId: complaint.complaintId,
      });
    }

    return res.json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Student confirm resolution (Accept -> Closed, Reject -> Reopened)
// @route   PATCH /api/complaints/:id/resolution
export const confirmResolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { accepted, comment } = req.body;

    let complaint = await Complaint.findById(id);
    if (!complaint) {
      complaint = await Complaint.findOne({ complaintId: id });
    }

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const prevStatus = complaint.status;
    const newStatus = accepted ? 'Closed' : 'Reopened';

    complaint.status = newStatus;
    complaint.resolutionFeedback = {
      accepted,
      comment: comment || '',
      submittedAt: new Date(),
    };

    await complaint.save();

    // Save Status History
    await StatusHistory.create({
      complaint: complaint._id,
      previousStatus: prevStatus,
      newStatus,
      changedBy: req.user.fullName,
      changedByRole: 'student',
      remark: accepted ? `Student accepted resolution: ${comment}` : `Student rejected resolution: ${comment}`,
    });

    // Notify Admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await Notification.create({
        recipient: adminUser._id,
        title: accepted ? 'Resolution Accepted' : 'Resolution Rejected - Ticket Reopened',
        message: `Student ${req.user.fullName} ${accepted ? 'closed' : 'reopened'} complaint ${complaint.complaintId}. Note: ${comment || 'No comment'}`,
        type: accepted ? 'status_update' : 'reopened',
        complaintId: complaint.complaintId,
      });
    }

    return res.json({ message: `Complaint status updated to ${newStatus}`, complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
