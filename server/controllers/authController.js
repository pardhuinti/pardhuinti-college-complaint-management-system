import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
export const registerStudent = async (req, res) => {
  try {
    const {
      studentId,
      fullName,
      email,
      phoneNumber,
      department,
      academicYear,
      section,
      password,
    } = req.body;

    if (!fullName || !email || !password || !studentId) {
      return res.status(400).json({ message: 'Please provide all required registration fields.' });
    }

    const emailLower = email.toLowerCase().trim();
    const cleanStudentId = studentId.trim();

    // Check duplicate email
    const existingEmail = await User.findOne({ email: emailLower });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    // Check duplicate student ID
    const existingId = await User.findOne({ studentId: cleanStudentId });
    if (existingId) {
      return res.status(400).json({ message: 'A student with this Student ID is already registered.' });
    }

    // Create student (Strictly student role)
    const user = await User.create({
      studentId: cleanStudentId,
      fullName: fullName.trim(),
      email: emailLower,
      phoneNumber: phoneNumber ? phoneNumber.trim() : '',
      department: department || 'Computer Science & Engineering',
      academicYear: academicYear || '3rd Year',
      section: section || 'A',
      password,
      role: 'student', // Force student role
      avatar: '',     // Clean default avatar (No AI images)
      status: 'active',
    });

    return res.status(201).json({
      message: 'Registration successful! You can now log in.',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        studentId: user.studentId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        academicYear: user.academicYear,
        section: user.section,
        avatar: '',
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Registration failed.' });
  }
};

// @desc    Auth user & get token (Student / Admin)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter your email and password.' });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please verify your email and password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please verify your email and password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Your account is deactivated. Please contact college administration.' });
    }

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        message: `Account is registered as ${user.role}. Please use the correct ${user.role} login option.`,
      });
    }

    return res.json({
      message: 'Logged in successfully',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        studentId: user.studentId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        academicYear: user.academicYear,
        section: user.section,
        avatar: user.avatar || '',
        phoneNumber: user.phoneNumber || '',
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message || 'Login failed.' });
  }
};

// @desc    Change user password (Admin / Student)
// @route   PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, currentPassword, newPassword } = req.body;
    const currentPass = currentPassword || oldPassword;

    if (!currentPass || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const isMatch = await user.matchPassword(currentPass);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: error.message || 'Failed to update password.' });
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
export const getCurrentUser = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password simulation
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }
  res.json({
    message: `Password reset link dispatched to ${email}. Check your institutional mailbox.`,
  });
};

// @desc    Reset Password simulation
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }
  res.json({ message: 'Password updated successfully! You can now log in.' });
};
