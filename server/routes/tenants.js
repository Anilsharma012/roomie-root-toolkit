import express from 'express';
import Tenant from '../models/Tenant.js';
import Bed from '../models/Bed.js';
import Room from '../models/Room.js';
import Activity from '../models/Activity.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const tenants = await Tenant.find({ isActive: true })
      .populate('roomId')
      .populate('bedId')
      .sort({ createdAt: -1 });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id)
      .populate('roomId')
      .populate('bedId');
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const tenant = new Tenant(req.body);
    const savedTenant = await tenant.save();
    
    if (req.body.bedId) {
      await Bed.findByIdAndUpdate(req.body.bedId, {
        status: 'occupied',
        tenantId: savedTenant._id
      });
    }
    
    if (req.body.roomId) {
      const room = await Room.findById(req.body.roomId);
      if (room) {
        room.occupiedBeds = (room.occupiedBeds || 0) + 1;
        if (room.occupiedBeds >= room.capacity) {
          room.status = 'occupied';
        }
        await room.save();
      }
    }
    
    await Activity.create({
      type: 'check_in',
      title: `New tenant ${savedTenant.name} checked in`,
      tenantId: savedTenant._id,
      userId: req.user._id
    });
    
    res.status(201).json(savedTenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    if (tenant.bedId) {
      await Bed.findByIdAndUpdate(tenant.bedId, {
        status: 'vacant',
        tenantId: null
      });
    }
    
    if (tenant.roomId) {
      const room = await Room.findById(tenant.roomId);
      if (room && room.occupiedBeds > 0) {
        room.occupiedBeds -= 1;
        if (room.occupiedBeds < room.capacity) {
          room.status = 'available';
        }
        await room.save();
      }
    }
    
    tenant.isActive = false;
    tenant.status = 'left';
    tenant.leaveDate = new Date();
    await tenant.save();
    
    await Activity.create({
      type: 'check_out',
      title: `Tenant ${tenant.name} checked out`,
      tenantId: tenant._id,
      userId: req.user._id
    });
    
    res.json({ message: 'Tenant removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/count', protect, async (req, res) => {
  try {
    const total = await Tenant.countDocuments({ isActive: true, status: 'active' });
    res.json({ count: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
