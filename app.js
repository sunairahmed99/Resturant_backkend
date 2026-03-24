import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';



import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './Config/dbconfig.js';

// Routes
import authRoutes from './Routes/authRoutes.js';
import categoryRoutes from './Routes/categoryRoutes.js';
import menuItemRoutes from './Routes/menuItemRoutes.js';
import areaRoutes from './Routes/areaRoutes.js';
import branchRoutes from './Routes/branchRoutes.js';
import bannerRoutes from './Routes/bannerRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import customerRoutes from './Routes/customerRoutes.js';
import dashboardRoutes from './Routes/dashboardRoutes.js';
import analyticsRoutes from './Routes/analyticsRoutes.js';
import settingsRoutes from './Routes/settingsRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import bookingRoutes from './Routes/bookingRoutes.js';
import couponRoutes from './Routes/couponRoutes.js';

const app = express();

// Trust Vercel's proxy for express-rate-limit
app.set('trust proxy', 1);

// --- Production Middlewares ---
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    validate: { xForwardedForHeader: false },
    message: { status: 'error', message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', uptime: process.uptime() });
});

app.use(cors());
app.use(express.json());

// NoSQL Injection Protection (Express 5 Compatible)
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    next();
});

// Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/messages', messageRoutes);

// Secure Error Handler
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()}:`, err);
    const statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'production') {
        return res.status(statusCode).json({ status: 'error', message: 'Something went wrong' });
    }
    res.status(statusCode).json({ status: 'error', message: err.message, stack: err.stack });
});

export default app;