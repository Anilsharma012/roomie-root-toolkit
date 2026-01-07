import express from 'express';
import Billing from '../models/Billing.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const bills = await Billing.find()
      .populate('tenantId')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/pending', protect, async (req, res) => {
  try {
    const bills = await Billing.find({ status: { $in: ['pending', 'partial', 'overdue'] } })
      .populate('tenantId')
      .sort({ dueDate: 1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id).populate('tenantId');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const billNumber = `BILL-${Date.now()}`;
    const totalAmount = (req.body.rentAmount || 0) + 
                       (req.body.electricityCharges || 0) + 
                       (req.body.waterCharges || 0) + 
                       (req.body.maintenanceCharges || 0) + 
                       (req.body.otherCharges || 0);
    
    const bill = new Billing({
      ...req.body,
      billNumber,
      totalAmount,
      dueAmount: totalAmount - (req.body.paidAmount || 0)
    });
    const savedBill = await bill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const bill = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const bill = await Billing.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/pending', protect, async (req, res) => {
  try {
    const result = await Billing.aggregate([
      { $match: { status: { $in: ['pending', 'partial', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$dueAmount' }, count: { $sum: 1 } } }
    ]);
    res.json(result[0] || { total: 0, count: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
