import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import crypto from 'crypto';
import User from './models/User.js';
import Complaint from './models/Complaint.js';
import Notification from './models/Notification.js';
import StatusHistory from './models/StatusHistory.js';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // skip if custom dns not supported
}

const getDefaultCredentials = () => {
  const adminEmail =
    process.env.DEFAULT_ADMIN_EMAIL?.trim() ||
    `admin+${crypto.randomBytes(4).toString('hex')}@yourcollege.edu`;
  const studentEmail =
    process.env.DEFAULT_STUDENT_EMAIL?.trim() ||
    `student+${crypto.randomBytes(4).toString('hex')}@yourcollege.edu`;

  const adminPassword =
    process.env.DEFAULT_ADMIN_PASSWORD?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    crypto.randomBytes(10).toString('hex');

  const studentPassword =
    process.env.DEFAULT_STUDENT_PASSWORD?.trim() ||
    process.env.STUDENT_PASSWORD?.trim() ||
    crypto.randomBytes(10).toString('hex');

  return { adminEmail, adminPassword, studentEmail, studentPassword };
};

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('[Seed] Connected to MongoDB Atlas. Seeding records...');

    await User.deleteMany();
    await Complaint.deleteMany();
    await Notification.deleteMany();
    await StatusHistory.deleteMany();

    const { adminEmail, adminPassword, studentEmail, studentPassword } = getDefaultCredentials();
    const adminLowerEmail = adminEmail.toLowerCase();
    const studentLowerEmail = studentEmail.toLowerCase();

    let admin = await User.findOne({ $or: [{ email: adminLowerEmail }, { studentId: 'ADM-001', role: 'admin' }] });
    if (!admin) {
      admin = await User.create({
        studentId: 'ADM-001',
        fullName: 'Admin',
        email: adminLowerEmail,
        phoneNumber: '+1 800 555 0199',
        department: 'Administration & Infrastructure Management',
        academicYear: 'N/A',
        section: 'N/A',
        password: adminPassword,
        role: 'admin',
        avatar: '',
        status: 'active',
      });
    } else {
      admin.fullName = 'Admin';
      admin.email = adminLowerEmail;
      admin.password = adminPassword;
      await admin.save();
    }

    let student = await User.findOne({ $or: [{ email: studentLowerEmail }, { studentId: 'STU-2024-8841', role: 'student' }] });
    if (!student) {
      student = await User.create({
        studentId: 'STU-2024-8841',
        fullName: 'Alex Mercer',
        email: studentLowerEmail,
        phoneNumber: '+1 555 234 5678',
        department: 'Computer Science & Engineering',
        academicYear: '3rd Year',
        section: 'A',
        password: studentPassword,
        role: 'student',
        avatar: '',
        status: 'active',
      });
    } else {
      student.email = studentLowerEmail;
      student.password = studentPassword;
      await student.save();
    }

    await Complaint.create({
      complaintId: 'CMP-2026-1001',
      student: student._id,
      studentInfo: {
        fullName: student.fullName,
        studentId: student.studentId,
        email: student.email,
        department: student.department,
        phoneNumber: student.phoneNumber,
      },
      title: 'Projector Defective in Lab 304',
      category: 'Laboratory',
      description: 'Overhead projector flickering and powering down during programming lab.',
      location: 'Building B, 3rd Floor, Lab 304',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'IT Tech Support - Sam',
      adminRemarks: [
        {
          remark: 'Technician assigned to inspect HDMI cable and inverter.',
          addedBy: admin.fullName,
          createdAt: new Date(),
        },
      ],
    });

    console.log('[Seed] Seeding completed successfully!');
    console.log(`[Seed] Admin login: ${adminEmail}`);
    console.log(`[Seed] Student login: ${studentEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
