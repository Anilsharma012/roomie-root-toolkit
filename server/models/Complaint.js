import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG'
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  category: {
    type: String,
    enum: ['maintenance', 'cleanliness', 'noise', 'security', 'food', 'other'],
    default: 'other'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  resolution: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
