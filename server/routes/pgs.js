import express from 'express';
import PG from '../models/PG.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const pgs = await PG.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }
    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const pg = new PG(req.body);
    const savedPG = await pg.save();
    res.status(201).json(savedPG);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }
    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }
    res.json({ message: 'PG deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/init', async (req, res) => {
  try {
    const pgCount = await PG.countDocuments();
    if (pgCount === 0) {
      const pg = await PG.create({
        name: 'Parameshwari Girls PG',
        address: 'Main Location',
        phone: '',
        email: '',
        totalFloors: 3,
        totalRooms: 20,
        totalBeds: 120
      });
      res.json({ message: 'Default PG created', pg });
    } else {
      const pg = await PG.findOne();
      res.json({ message: 'PG already exists', pg });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
