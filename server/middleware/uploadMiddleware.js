import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Determine uploads directory safely based on environment
let uploadsDir = path.join(process.cwd(), 'uploads');

try {
  if (process.env.VERCEL) {
    uploadsDir = path.join(os.tmpdir(), 'uploads');
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  // Gracefully fallback to system temporary directory if current directory is read-only
  try {
    uploadsDir = path.join(os.tmpdir(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (tmpErr) {
    console.warn('[Upload Warning] Read-only environment detected, using memory storage fallback');
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images and PDFs only! Allowed formats: JPG, PNG, WEBP, GIF, PDF'));
  }
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

