import bcrypt from 'bcryptjs';

// Pre-hashed default password for easy demo logins: "Password123"
const DEMO_PASSWORD_HASH = bcrypt.hashSync('Password123', 10);

class MockDataStore {
  constructor() {
    this.users = [
      {
        _id: 'usr_admin_01',
        studentId: 'ADM-001',
        fullName: 'Dr. Robert Vance (Chief Admin)',
        email: 'admin@college.edu',
        phoneNumber: '+1 800 555 0199',
        department: 'Administration & Facilities',
        academicYear: 'N/A',
        section: 'N/A',
        password: DEMO_PASSWORD_HASH,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        status: 'active',
        createdAt: new Date('2026-01-01T08:00:00Z'),
      },
      {
        _id: 'usr_student_01',
        studentId: 'STU-2024-8841',
        fullName: 'Alex Mercer',
        email: 'alex.mercer@student.college.edu',
        phoneNumber: '+1 555 234 5678',
        department: 'Computer Science & Engineering',
        academicYear: '3rd Year',
        section: 'A',
        password: DEMO_PASSWORD_HASH,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
        status: 'active',
        createdAt: new Date('2026-01-15T10:30:00Z'),
      },
      {
        _id: 'usr_student_02',
        studentId: 'STU-2024-9912',
        fullName: 'Sophia Chen',
        email: 'sophia.chen@student.college.edu',
        phoneNumber: '+1 555 987 6543',
        department: 'Electronics & Communication',
        academicYear: '2nd Year',
        section: 'B',
        password: DEMO_PASSWORD_HASH,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
        status: 'active',
        createdAt: new Date('2026-02-01T11:00:00Z'),
      },
      {
        _id: 'usr_student_03',
        studentId: 'STU-2023-4410',
        fullName: 'David K. Miller',
        email: 'david.miller@student.college.edu',
        phoneNumber: '+1 555 444 3322',
        department: 'Mechanical Engineering',
        academicYear: '4th Year',
        section: 'A',
        password: DEMO_PASSWORD_HASH,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        status: 'active',
        createdAt: new Date('2026-02-05T14:20:00Z'),
      }
    ];

    this.complaints = [
      {
        _id: 'cmp_1001',
        complaintId: 'CMP-2026-1001',
        student: 'usr_student_01',
        studentInfo: {
          fullName: 'Alex Mercer',
          studentId: 'STU-2024-8841',
          email: 'alex.mercer@student.college.edu',
          department: 'Computer Science & Engineering',
          phoneNumber: '+1 555 234 5678',
        },
        title: 'Projector Defective in Lab 304',
        category: 'Laboratory',
        description: 'The overhead projector in Computer Lab 304 keeps flickering and shutting down every 10 minutes, disrupting ongoing lab assessments and lectures.',
        location: 'Building B, 3rd Floor, Lab 304',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'IT Infrastructure Dept - Tech Specialist Sam',
        attachments: [
          {
            filename: 'projector_flicker_error.jpg',
            url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
            uploadedAt: new Date('2026-08-01T09:15:00Z'),
          }
        ],
        adminRemarks: [
          {
            remark: 'Technician assigned to inspect power inverter and HDMI cable connectivity.',
            addedBy: 'Dr. Robert Vance (Chief Admin)',
            createdAt: new Date('2026-08-01T11:00:00Z'),
          }
        ],
        createdAt: new Date('2026-08-01T09:15:00Z'),
        updatedAt: new Date('2026-08-02T10:00:00Z'),
      },
      {
        _id: 'cmp_1002',
        complaintId: 'CMP-2026-1002',
        student: 'usr_student_02',
        studentInfo: {
          fullName: 'Sophia Chen',
          studentId: 'STU-2024-9912',
          email: 'sophia.chen@student.college.edu',
          department: 'Electronics & Communication',
          phoneNumber: '+1 555 987 6543',
        },
        title: 'High Speed Wi-Fi Disconnected at Central Library 2nd Floor',
        category: 'Internet',
        description: 'Campus WiFi router on the 2nd floor reading hall is showing invalid gateway credentials and failing authentication.',
        location: 'Central Library, 2nd Floor Reading Room',
        priority: 'Urgent',
        status: 'Resolved',
        assignedTo: 'Network Systems Team',
        attachments: [],
        adminRemarks: [
          {
            remark: 'Access point firmware rebooted and DHCP IP pool expanded.',
            addedBy: 'Dr. Robert Vance (Chief Admin)',
            createdAt: new Date('2026-08-03T14:00:00Z'),
          }
        ],
        createdAt: new Date('2026-08-03T08:30:00Z'),
        updatedAt: new Date('2026-08-03T14:00:00Z'),
      },
      {
        _id: 'cmp_1003',
        complaintId: 'CMP-2026-1003',
        student: 'usr_student_01',
        studentInfo: {
          fullName: 'Alex Mercer',
          studentId: 'STU-2024-8841',
          email: 'alex.mercer@student.college.edu',
          department: 'Computer Science & Engineering',
          phoneNumber: '+1 555 234 5678',
        },
        title: 'AC Water Leakage in Classroom 102',
        category: 'Classroom',
        description: 'Water dripping heavily from split AC unit onto student desks near row 3.',
        location: 'Academic Block A, Classroom 102',
        priority: 'Medium',
        status: 'Pending',
        assignedTo: 'Unassigned',
        attachments: [],
        adminRemarks: [],
        createdAt: new Date('2026-08-05T13:45:00Z'),
        updatedAt: new Date('2026-08-05T13:45:00Z'),
      },
      {
        _id: 'cmp_1004',
        complaintId: 'CMP-2026-1004',
        student: 'usr_student_03',
        studentInfo: {
          fullName: 'David K. Miller',
          studentId: 'STU-2023-4410',
          email: 'david.miller@student.college.edu',
          department: 'Mechanical Engineering',
          phoneNumber: '+1 555 444 3322',
        },
        title: 'Water Purifier Not Functioning in Hostel Block C',
        category: 'Water Supply',
        description: 'RO water dispenser on 3rd floor hostel C is leaking and filter light is flashing red.',
        location: 'Hostel Block C, 3rd Floor',
        priority: 'Urgent',
        status: 'Under Review',
        assignedTo: 'Facilities Repair Desk',
        attachments: [],
        adminRemarks: [
          {
            remark: 'Procurement order placed for new replacement filter cartridge.',
            addedBy: 'Dr. Robert Vance (Chief Admin)',
            createdAt: new Date('2026-08-06T10:15:00Z'),
          }
        ],
        createdAt: new Date('2026-08-06T09:00:00Z'),
        updatedAt: new Date('2026-08-06T10:15:00Z'),
      },
      {
        _id: 'cmp_1005',
        complaintId: 'CMP-2026-1005',
        student: 'usr_student_02',
        studentInfo: {
          fullName: 'Sophia Chen',
          studentId: 'STU-2024-9912',
          email: 'sophia.chen@student.college.edu',
          department: 'Electronics & Communication',
          phoneNumber: '+1 555 987 6543',
        },
        title: 'Shuttle Bus Schedule Delay during Peak Hours',
        category: 'Transport',
        description: 'Morning bus route 4 arrived 40 minutes late due to tire maintenance delay.',
        location: 'Campus South Gate Shuttle Terminal',
        priority: 'Low',
        status: 'Closed',
        assignedTo: 'Transport Officer Department',
        attachments: [],
        adminRemarks: [
          {
            remark: 'Extra backup shuttle dispatched during peak 8:00 AM - 9:30 AM hours.',
            addedBy: 'Dr. Robert Vance (Chief Admin)',
            createdAt: new Date('2026-07-28T16:00:00Z'),
          }
        ],
        resolutionFeedback: {
          accepted: true,
          comment: 'Appreciate the quick response and additional bus deployment!',
          submittedAt: new Date('2026-07-29T10:00:00Z'),
        },
        createdAt: new Date('2026-07-27T10:00:00Z'),
        updatedAt: new Date('2026-07-29T10:00:00Z'),
      }
    ];

    this.notifications = [
      {
        _id: 'notif_01',
        recipient: 'usr_student_01',
        title: 'Complaint In Progress',
        message: 'Your complaint CMP-2026-1001 (Projector Defective) status updated to In Progress by Dr. Robert Vance.',
        type: 'status_update',
        complaintId: 'CMP-2026-1001',
        isRead: false,
        createdAt: new Date('2026-08-02T10:00:00Z'),
      },
      {
        _id: 'notif_02',
        recipient: 'usr_student_02',
        title: 'Complaint Resolved! Please Confirm',
        message: 'Your complaint CMP-2026-1002 (High Speed Wi-Fi Disconnected) has been marked as Resolved. Please verify resolution.',
        type: 'resolution_requested',
        complaintId: 'CMP-2026-1002',
        isRead: false,
        createdAt: new Date('2026-08-03T14:00:00Z'),
      },
      {
        _id: 'notif_03',
        recipient: 'usr_admin_01',
        title: 'New Complaint Registered',
        message: 'Student Alex Mercer raised a High priority complaint (CMP-2026-1003).',
        type: 'complaint_created',
        complaintId: 'CMP-2026-1003',
        isRead: false,
        createdAt: new Date('2026-08-05T13:45:00Z'),
      }
    ];

    this.statusHistories = [
      {
        _id: 'hist_01',
        complaint: 'cmp_1001',
        previousStatus: 'Pending',
        newStatus: 'Under Review',
        changedBy: 'Dr. Robert Vance (Chief Admin)',
        remark: 'Reviewing lab technician availability.',
        createdAt: new Date('2026-08-01T10:00:00Z'),
      },
      {
        _id: 'hist_02',
        complaint: 'cmp_1001',
        previousStatus: 'Under Review',
        newStatus: 'In Progress',
        changedBy: 'Dr. Robert Vance (Chief Admin)',
        remark: 'Technician assigned to replace cable and test power supply.',
        createdAt: new Date('2026-08-02T10:00:00Z'),
      }
    ];
  }

  // Helper getters
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id || (u.id && u.id === id));
  }

  findComplaintById(id) {
    return this.complaints.find(c => c._id === id || c.complaintId === id);
  }
}

export const mockStore = new MockDataStore();
