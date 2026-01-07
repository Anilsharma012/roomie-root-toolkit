import express from 'express';
import Activity from '../models/Activity.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('tenantId')
      .populate('userId')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recent', protect, async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('tenantId')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const activity = new Activity({
      ...req.body,
      userId: req.user._id
    });
    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
