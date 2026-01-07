import express from 'express';
import Admin from '../models/Admin.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    
    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
      
      res.json({
        _id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;
    
    const adminExists = await Admin.findOne({ username });
    
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const admin = await Admin.create({
      username,
      password,
      name,
      email,
      role: role || 'admin'
    });
    
    const token = generateToken(admin._id);
    
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.post('/init', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const admin = await Admin.create({
        username: 'admin',
        password: 'admin123',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'superadmin'
      });
      res.json({ message: 'Default admin created', username: 'admin', password: 'admin123' });
    } else {
      res.json({ message: 'Admin already exists' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
