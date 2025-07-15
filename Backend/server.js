import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import urlRoutes from './routes/urlRoutes.js';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger); //  Logging Middleware

app.use('/api', urlRoutes);

app.use(errorHandler); //  error handler

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
