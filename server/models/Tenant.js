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
    type: { type: String },
    filename: { type: String },
    data: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  photo: {
    type: String,
    default: ''
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  occupation: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Tenant', tenantSchema);
