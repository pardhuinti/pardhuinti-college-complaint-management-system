import mongoose from 'mongoose';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

/**
 * Global connection cache for serverless environments (e.g. Vercel)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isSeeded: false };
}

const getDefaultCredentials = () => {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL?.trim() || 'admin@college.edu';
  const studentEmail = process.env.DEFAULT_STUDENT_EMAIL?.trim() || 'student@college.edu';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD?.trim() || 'Admin@2026!';
  const studentPassword = process.env.DEFAULT_STUDENT_PASSWORD?.trim() || 'Student@2026!';

  return { adminEmail, adminPassword, studentEmail, studentPassword };
};

/**
 * Derives a direct replica set URI from an SRV URI for resilient failover
 * when DNS SRV resolution encounters ECONNREFUSED or restricted UDP port 53.
 */
const getDirectReplicaUri = (srvUri) => {
  if (process.env.MONGODB_DIRECT_URI) {
    return process.env.MONGODB_DIRECT_URI.trim();
  }

  if (!srvUri || !srvUri.startsWith('mongodb+srv://')) {
    return null;
  }

  try {
    const match = srvUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);
    if (!match) return null;
    const [, user, pass, clusterHost, dbName] = match;

    if (clusterHost.includes('cluster0.gmet98d.mongodb.net')) {
      const shardHosts = [
        'ac-02ww9ym-shard-00-00.gmet98d.mongodb.net:27017',
        'ac-02ww9ym-shard-00-01.gmet98d.mongodb.net:27017',
        'ac-02ww9ym-shard-00-02.gmet98d.mongodb.net:27017',
      ].join(',');
      return `mongodb://${user}:${pass}@${shardHosts}/${dbName}?ssl=true&replicaSet=atlas-iua3u8-shard-0&authSource=admin&retryWrites=true&w=majority`;
    }
  } catch (e) {
    // Return null if regex fails
  }
  return null;
};

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;

  if (!primaryUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // If already connected, return cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    };

    console.log('[Database] Establishing MongoDB connection...');

    const attemptConnect = async () => {
      try {
        const instance = await mongoose.connect(primaryUri, opts);
        console.log(`[Database] MongoDB Connected: ${instance.connection.host}`);
        return instance;
      } catch (srvError) {
        const isSrvIssue =
          srvError.message.includes('querySrv') ||
          srvError.message.includes('ECONNREFUSED') ||
          srvError.message.includes('ENOTFOUND') ||
          srvError.message.includes('Server selection timed out');

        const fallbackUri = getDirectReplicaUri(primaryUri);

        if (isSrvIssue && fallbackUri) {
          console.warn(`[Database Warning] SRV lookup issue encountered: ${srvError.message}`);
          console.log('[Database] Activating direct replica set fallback connection...');
          try {
            const fallbackInstance = await mongoose.connect(fallbackUri, opts);
            console.log(
              `[Database] MongoDB Connected (via ReplicaSet Fallback): ${fallbackInstance.connection.host}`
            );
            return fallbackInstance;
          } catch (fallbackError) {
            console.error(`[Database Error] Direct fallback connection failed: ${fallbackError.message}`);
            throw fallbackError;
          }
        }
        throw srvError;
      }
    };

    cached.promise = attemptConnect();
  }

  try {
    cached.conn = await cached.promise;

    // Seed initial demo data once per deployment lifecycle if needed
    if (!cached.isSeeded) {
      cached.isSeeded = true;
      seedInitialData().catch((err) => {
        console.warn('[Database Seed Warning]:', err.message);
      });
    }
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error(`[Database Error] Connection failure: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

export const seedInitialData = async () => {
  try {
    const { adminEmail, adminPassword, studentEmail, studentPassword } = getDefaultCredentials();
    const adminLowerEmail = adminEmail.toLowerCase();
    const studentLowerEmail = studentEmail.toLowerCase();

    // Check if admin user exists; create only if missing
    let existingAdmin = await User.findOne({
      $or: [{ email: adminLowerEmail }, { studentId: 'ADM-001', role: 'admin' }],
    });

    if (!existingAdmin) {
      existingAdmin = await User.create({
        studentId: 'ADM-001',
        fullName: 'Administrator',
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
    }

    // Check if student user exists; create only if missing
    let studentAccount = await User.findOne({
      $or: [{ email: studentLowerEmail }, { studentId: 'STU-2024-8841', role: 'student' }],
    });

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
    }

    // Check if demo complaint exists; create only if collection is empty
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
            addedBy: 'Administrator',
            createdAt: new Date(),
          },
        ],
      });
    }
  } catch (err) {
    console.error('[Database Seed Error]:', err.message);
  }
};
