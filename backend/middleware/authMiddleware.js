import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User session not found or account has been removed.' });
      }

      if (req.user.status === 'deactivated' || req.user.status === 'suspended') {
        return res.status(403).json({ message: 'Your account has been deactivated by administration.' });
      }

      return next();
    } catch (error) {
      console.error('Auth verification failure:', error.message);
      return res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Access token required.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Access restricted to System Administrators only.' });
  }
};
