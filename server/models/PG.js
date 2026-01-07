import mongoose from 'mongoose';

const pgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  totalFloors: {
    type: Number,
    default: 0
  },
  totalRooms: {
    type: Number,
    default: 0
  },
  totalBeds: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('PG', pgSchema);
