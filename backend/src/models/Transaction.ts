import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
  status: { type: String, enum: ['COMPLETED', 'PENDING'], required: true, default: 'COMPLETED' },
  category: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  title: { type: String, required: true },
  notes: { type: String },
  currency: { type: String, required: true, default: 'USD' }
}, { timestamps: true });

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, status: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
