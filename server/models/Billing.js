import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  rentAmount: {
    type: Number,
    default: 0
  },
  electricityCharges: {
    type: Number,
    default: 0
  },
  waterCharges: {
    type: Number,
    default: 0
  },
  maintenanceCharges: {
    type: Number,
    default: 0
  },
  otherCharges: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  generatedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Billing', billingSchema);
