import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);



export default app;
