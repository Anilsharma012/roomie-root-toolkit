import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  relation: { type: String },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  purpose: { type: String, required: true },
  phone: { type: String, required: true },
  idType: { type: String },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  status: { type: String, enum: ['inside', 'exited'], default: 'inside' }
}, { timestamps: true });

export default mongoose.model('Visitor', visitorSchema);
