import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  billingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billing'
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'bank_transfer', 'card', 'other'],
    default: 'cash'
  },
  transactionId: {
    type: String,
    default: ''
  },
  receiptNumber: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['rent', 'deposit', 'maintenance', 'other'],
    default: 'rent'
  }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
