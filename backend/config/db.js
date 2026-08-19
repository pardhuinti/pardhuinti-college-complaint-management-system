import mongoose from 'mongoose';
import dns from 'dns';
import crypto from 'crypto';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

// Configure DNS resolvers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Ignore DNS override errors if custom DNS is not permitted
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

export const connectDB = async () => {
  try {
    console.log('[Database] Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

    await seedInitialData();
  } catch (error) {
    console.error(`[Database Error] Connection failure: ${error.message}`);
  }
};

const seedInitialData = async () => {
  try {
    const { adminEmail, adminPassword, studentEmail, studentPassword } = getDefaultCredentials();
    const adminLowerEmail = adminEmail.toLowerCase();
    const studentLowerEmail = studentEmail.toLowerCase();

    let existingAdmin = await User.findOne({
      $or: [{ email: adminLowerEmail }, { studentId: 'ADM-001', role: 'admin' }],
    });
    let existingStudent = await User.findOne({
      $or: [{ email: studentLowerEmail }, { studentId: 'STU-2024-8841', role: 'student' }],
    });

    if (!existingAdmin) {
      existingAdmin = await User.create({
        studentId: 'ADM-001',
        fullName: 'Pardhu',
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
      console.log('[Seed] Admin user created successfully with email:', adminLowerEmail);
    } else {
      // Delete and recreate admin to ensure password is correctly hashed
      await User.deleteOne({ _id: existingAdmin._id });
      existingAdmin = await User.create({
        studentId: 'ADM-001',
        fullName: 'Pardhu',
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
      console.log('[Seed] Admin user reset with updated credentials for email:', adminLowerEmail);
    }

    let studentAccount = existingStudent;
    if (!studentAccount) {
      studentAccount = await User.create({
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
      console.log('[Seed] Student user created successfully with email:', studentLowerEmail);
    } else {
      // Delete and recreate student to ensure password is correctly hashed
      await User.deleteOne({ _id: existingStudent._id });
      studentAccount = await User.create({
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
      console.log('[Seed] Student user reset with updated credentials for email:', studentLowerEmail);
    }

    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0 && studentAccount) {
      await Complaint.create({
        complaintId: 'CMP-2026-1001',
        student: studentAccount._id,
        studentInfo: {
          fullName: studentAccount.fullName,
          studentId: studentAccount.studentId,
          email: studentAccount.email,
          department: studentAccount.department,
          phoneNumber: studentAccount.phoneNumber,
        },
        title: 'Projector Defective in Lab 304',
        category: 'Laboratory',
        description: 'Overhead projector flickering and powering down during lab assessments.',
        location: 'Building B, 3rd Floor, Lab 304',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'IT Tech Support - Sam',
        adminRemarks: [
          {
            remark: 'Technician assigned to inspect HDMI cable and inverter.',
            addedBy: 'Pardhu',
            createdAt: new Date(),
          },
        ],
      });
    }

    console.log('[Database Seed] Default admin and student accounts are ready for login.');
    console.log(`[Database Seed] Admin email: ${adminEmail}`);
    console.log(`[Database Seed] Student email: ${studentEmail}`);
  } catch (err) {
    console.error('[Database Seed Error]:', err.message);
  }
};
