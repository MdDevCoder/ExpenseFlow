import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  status: 'ACTIVE' | 'ARCHIVED';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    period: {
      type: String,
      enum: ['WEEKLY', 'MONTHLY', 'YEARLY'],
      required: true,
      default: 'MONTHLY'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      required: true,
      default: 'ACTIVE'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries and preventing duplicate active budgets per category
budgetSchema.index({ userId: 1, category: 1, status: 1 });
budgetSchema.index({ userId: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IBudget>('Budget', budgetSchema);
