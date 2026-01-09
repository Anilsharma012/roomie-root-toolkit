import express from 'express';
import { protect } from '../middleware/auth.js';
import Activity from '../models/Activity.js';
import Tenant from '../models/Tenant.js';
import mongoose from 'mongoose';

const router = express.Router();

// Define a simple Schema for GatePass if it doesn't exist
// In a real app, this would be in models/GatePass.js
const gatePassSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  reason: { type: String, required: true },
  departureTime: { type: Date, required: true },
  expectedReturn: { type: Date },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const GatePass = mongoose.models.GatePass || mongoose.model('GatePass', gatePassSchema);

router.get('/', protect, async (req, res) => {
  try {
    const passes = await GatePass.find()
      .populate({
        path: 'tenantId',
        populate: { path: 'roomId' }
      })
      .sort({ createdAt: -1 });
    res.json(passes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const pass = new GatePass(req.body);
    const savedPass = await pass.save();
    
    const tenant = await Tenant.findById(req.body.tenantId);
    
    await Activity.create({
      type: 'security',
      title: `Gate pass requested for ${tenant?.name || 'Tenant'}`,
      tenantId: req.body.tenantId,
      userId: req.user._id
    });
    
    res.status(201).json(savedPass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
