import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG'
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['furniture', 'electronics', 'kitchen', 'cleaning', 'bedding', 'other'],
    default: 'other'
  },
  quantity: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: 'pcs'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  purchasePrice: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    enum: ['new', 'good', 'fair', 'poor', 'damaged'],
    default: 'new'
  },
  location: {
    type: String,
    default: ''
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);
