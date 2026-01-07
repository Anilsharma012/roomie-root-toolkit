import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG',
    required: true
  },
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple', 'quad'],
    default: 'single'
  },
  capacity: {
    type: Number,
    default: 1
  },
  occupiedBeds: {
    type: Number,
    default: 0
  },
  rentAmount: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
