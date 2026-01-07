import express from 'express';
import Payment from '../models/Payment.js';
import Billing from '../models/Billing.js';
import Activity from '../models/Activity.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('tenantId')
      .populate('billingId')
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const payments = await Payment.find({
      paymentDate: { $gte: today, $lt: tomorrow }
    }).populate('tenantId');
    
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ payments, total, count: payments.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('tenantId')
      .populate('billingId');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const receiptNumber = `RCP-${Date.now()}`;
    const payment = new Payment({
      ...req.body,
      receiptNumber
    });
    const savedPayment = await payment.save();
    
    if (req.body.billingId) {
      const bill = await Billing.findById(req.body.billingId);
      if (bill) {
        bill.paidAmount = (bill.paidAmount || 0) + req.body.amount;
        bill.dueAmount = bill.totalAmount - bill.paidAmount;
        bill.status = bill.dueAmount <= 0 ? 'paid' : 'partial';
        await bill.save();
      }
    }
    
    await Activity.create({
      type: 'payment',
      title: `Payment of Rs.${req.body.amount} received`,
      tenantId: req.body.tenantId,
      userId: req.user._id,
      metadata: { amount: req.body.amount, receiptNumber }
    });
    
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
