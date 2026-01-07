import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema({
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  bedNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['vacant', 'occupied', 'reserved', 'maintenance'],
    default: 'vacant'
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    default: null
  },
  rentAmount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Bed', bedSchema);
