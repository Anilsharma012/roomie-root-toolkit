import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG'
  },
  category: {
    type: String,
    enum: ['maintenance', 'utilities', 'salary', 'supplies', 'repairs', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paidTo: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'bank_transfer', 'card', 'other'],
    default: 'cash'
  },
  receiptUrl: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
