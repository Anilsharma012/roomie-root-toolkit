import express from 'express';
import Floor from '../models/Floor.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const floors = await Floor.find({ isActive: true })
      .populate('pgId')
      .sort({ floorNumber: 1 });
    res.json(floors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id).populate('pgId');
    if (!floor) {
      return res.status(404).json({ message: 'Floor not found' });
    }
    res.json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

import PG from '../models/PG.js';

router.post('/', protect, async (req, res) => {
  try {
    let { pgId } = req.body;
    
    if (!pgId) {
      const defaultPG = await PG.findOne();
      if (!defaultPG) {
        return res.status(400).json({ message: 'No PG found. Please initialize PG first.' });
      }
      pgId = defaultPG._id;
    }

    const floor = new Floor({
      ...req.body,
      pgId
    });
    const savedFloor = await floor.save();
    res.status(201).json(savedFloor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const floor = await Floor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!floor) {
      return res.status(404).json({ message: 'Floor not found' });
    }
    res.json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const floor = await Floor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!floor) {
      return res.status(404).json({ message: 'Floor not found' });
    }
    res.json({ message: 'Floor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
