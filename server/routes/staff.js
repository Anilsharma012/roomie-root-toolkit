import express from 'express';
import Staff from '../models/Staff.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true })
      .populate('pgId')
      .sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const staffMember = await Staff.findById(req.params.id).populate('pgId');
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staffMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const staffMember = new Staff(req.body);
    const savedStaff = await staffMember.save();
    res.status(201).json(savedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const staffMember = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staffMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const staffMember = await Staff.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
