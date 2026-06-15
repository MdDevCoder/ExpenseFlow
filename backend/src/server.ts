import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import budgetRoutes from './routes/budgetRoutes';
import reportRoutes from './routes/reportRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('ExpenseFlow API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
