import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import tenantsRoutes from './routes/tenants.js';
import roomsRoutes from './routes/rooms.js';
import floorsRoutes from './routes/floors.js';
import bedsRoutes from './routes/beds.js';
import billingRoutes from './routes/billing.js';
import paymentsRoutes from './routes/payments.js';
import expensesRoutes from './routes/expenses.js';
import inventoryRoutes from './routes/inventory.js';
import staffRoutes from './routes/staff.js';
import complaintsRoutes from './routes/complaints.js';
import notificationsRoutes from './routes/notifications.js';
import activitiesRoutes from './routes/activities.js';
import pgsRoutes from './routes/pgs.js';
import dashboardRoutes from './routes/dashboard.js';
import servicesRoutes from './routes/services.js';
import visitorsRoutes from './routes/visitors.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

connectDB();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/floors', floorsRoutes);
app.use('/api/beds', bedsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/pgs', pgsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/visitors', visitorsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Server running on port ${PORT}`);
});
