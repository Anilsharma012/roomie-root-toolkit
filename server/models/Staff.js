import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG'
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['manager', 'caretaker', 'security', 'housekeeping', 'cook', 'other'],
    default: 'other'
  },
  salary: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    default: ''
  },
  aadharNumber: {
    type: String,
    default: ''
  },
  documents: [{
    name: { type: String },
    url: { type: String }
  }],
  photo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);
