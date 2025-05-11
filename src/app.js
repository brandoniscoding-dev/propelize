// src/app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const vehicleRoutes = require('./routes/vehicle.routes');

// const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Global Error Handler
// app.use(errorHandler);

module.exports = app;
