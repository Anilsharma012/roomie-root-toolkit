import express from 'express';
import Billing from '../models/Billing.js';
import Tenant from '../models/Tenant.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

function getMonthNumber(month) {
  const months = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
  return months[month.toLowerCase()] || 0;
}

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

router.get('/export', protect, async (req, res) => {
  try {
    const bills = await Billing.find().populate('tenantId').sort({ createdAt: -1 });
    
    const csv = [
      'Bill Number,Tenant,Month,Year,Rent,Total,Paid,Due,Status,Due Date',
      ...bills.map(b => 
        `${b.billNumber},${b.tenantId?.name || 'Unknown'},${b.month},${b.year},${b.rentAmount},${b.totalAmount},${b.paidAmount},${b.dueAmount},${b.status},${b.dueDate?.toISOString().split('T')[0] || ''}`
      )
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=billing-export.csv');
    res.send(csv);
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

router.post('/generate', protect, async (req, res) => {
  try {
    const { month, year } = req.body;
    
    const activeTenants = await Tenant.find({ isActive: true, status: 'active' });
    const generated = [];
    const skipped = [];
    
    for (const tenant of activeTenants) {
      const existing = await Billing.findOne({ 
        tenantId: tenant._id, 
        month, 
        year 
      });
      
      if (existing) {
        skipped.push(tenant.name);
        continue;
      }
      
      const billNumber = `BILL-${year}-${month.toUpperCase().slice(0, 3)}-${Date.now()}`;
      const totalAmount = tenant.rentAmount || 0;
      
      const bill = new Billing({
        tenantId: tenant._id,
        billNumber,
        month,
        year,
        rentAmount: tenant.rentAmount || 0,
        totalAmount,
        dueAmount: totalAmount,
        dueDate: new Date(year, getMonthNumber(month), 5),
        status: 'pending'
      });
      
      await bill.save();
      generated.push(tenant.name);
    }
    
    res.json({ 
      message: `Generated ${generated.length} bills, skipped ${skipped.length} existing`,
      generated,
      skipped
    });
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

export default router;
