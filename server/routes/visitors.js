import express from 'express';
import Visitor from '../models/Visitor.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const visitors = await Visitor.find().populate('tenantId').sort({ entryTime: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const visitor = new Visitor(req.body);
    const savedVisitor = await visitor.save();
    res.status(201).json(savedVisitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/exit', protect, async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { exitTime: new Date(), status: 'exited' },
      { new: true }
    );
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
