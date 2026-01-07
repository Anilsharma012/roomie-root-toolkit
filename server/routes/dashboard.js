import express from 'express';
import Tenant from '../models/Tenant.js';
import Bed from '../models/Bed.js';
import Billing from '../models/Billing.js';
import Payment from '../models/Payment.js';
import Activity from '../models/Activity.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, async (req, res) => {
  try {
    const totalBeds = await Bed.countDocuments({ isActive: true });
    const vacantBeds = await Bed.countDocuments({ isActive: true, status: 'vacant' });
    const activeTenants = await Tenant.countDocuments({ isActive: true, status: 'active' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayPayments = await Payment.aggregate([
      { $match: { paymentDate: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    const pendingDues = await Billing.aggregate([
      { $match: { status: { $in: ['pending', 'partial', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$dueAmount' }, count: { $sum: 1 } } }
    ]);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    const newTenantsThisMonth = await Tenant.countDocuments({
      createdAt: { $gte: thisMonth, $lt: nextMonth }
    });
    
    res.json({
      totalBeds,
      vacantBeds,
      occupiedBeds: totalBeds - vacantBeds,
      activeTenants,
      todayCollection: todayPayments[0]?.total || 0,
      todayPaymentsCount: todayPayments[0]?.count || 0,
      pendingDues: pendingDues[0]?.total || 0,
      pendingDuesCount: pendingDues[0]?.count || 0,
      newTenantsThisMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recent-activities', protect, async (req, res) => {
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

router.get('/upcoming-dues', protect, async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingDues = await Billing.find({
      status: { $in: ['pending', 'partial'] },
      dueDate: { $lte: nextWeek }
    })
      .populate('tenantId')
      .sort({ dueDate: 1 })
      .limit(10);
    
    res.json(upcomingDues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
