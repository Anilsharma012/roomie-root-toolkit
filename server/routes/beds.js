import express from 'express';
import Bed from '../models/Bed.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const beds = await Bed.find({ isActive: true })
      .populate('roomId')
      .populate('tenantId')
      .sort({ bedNumber: 1 });
    res.json(beds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/vacant', protect, async (req, res) => {
  try {
    const beds = await Bed.find({ isActive: true, status: 'vacant' })
      .populate('roomId')
      .sort({ bedNumber: 1 });
    res.json(beds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id)
      .populate('roomId')
      .populate('tenantId');
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json(bed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { bedNumber, roomId, monthlyRent } = req.body;
    
    if (!bedNumber || !roomId) {
      return res.status(400).json({ message: 'Bed number and Room ID are required' });
    }

    const bed = new Bed({
      bedNumber,
      roomId,
      monthlyRent: monthlyRent || 0,
      status: 'vacant',
      isActive: true
    });
    
    const savedBed = await bed.save();
    
    // Optional: Populate before returning
    const populatedBed = await Bed.findById(savedBed._id).populate('roomId');
    
    res.status(201).json(populatedBed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json(bed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json({ message: 'Bed deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/count', protect, async (req, res) => {
  try {
    const total = await Bed.countDocuments({ isActive: true });
    const vacant = await Bed.countDocuments({ isActive: true, status: 'vacant' });
    res.json({ total, vacant, occupied: total - vacant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
