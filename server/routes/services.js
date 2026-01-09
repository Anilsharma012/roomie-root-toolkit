import express from 'express';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    
    const services = await Service.find(query)
      .populate('tenantId')
      .populate('roomId')
      .populate('assignedTo')
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await Service.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 }, pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } } } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('tenantId')
      .populate('roomId')
      .populate('assignedTo');
    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.status === 'completed' && !req.body.completedDate) {
      updateData.completedDate = new Date();
    }
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    res.json({ message: 'Service request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
