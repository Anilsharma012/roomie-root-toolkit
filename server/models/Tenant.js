import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  aadharNumber: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' }
  },
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG'
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  bedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed'
  },
  rentAmount: {
    type: Number,
    default: 0
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  leaveDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'left'],
    default: 'active'
  },
  documents: [{
    name: { type: String },
    url: { type: String },
    type: { type: String }
  }],
  photo: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Tenant', tenantSchema);
