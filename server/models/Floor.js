import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema({
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG',
    required: true
  },
  floorNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  totalRooms: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Floor', floorSchema);
