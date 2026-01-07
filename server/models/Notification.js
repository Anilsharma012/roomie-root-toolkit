import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['payment', 'complaint', 'tenant', 'system', 'reminder'],
    default: 'system'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  link: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
