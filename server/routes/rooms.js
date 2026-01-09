import express from 'express';
import Room from '../models/Room.js';
import Floor from '../models/Floor.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true })
      .populate('floorId')
      .sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('floorId');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
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

    const room = new Room({
      ...req.body,
      pgId
    });
    const savedRoom = await room.save();
    
    // Update floor room count
    await Floor.findByIdAndUpdate(req.body.floorId, {
      $inc: { totalRooms: 1, totalBeds: req.body.capacity }
    });
    
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
