const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI || !JWT_SECRET) {
  console.error('Missing required environment variables: MONGO_URI (or MONGODB_URI) and JWT_SECRET must be set.');
  process.exit(1);
}

const app = express();
app.use(express.json());

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    corsOrigin && corsOrigin !== '*'
      ? { origin: corsOrigin.split(',').map((origin) => origin.trim()) }
      : undefined
  )
);

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    db: connected ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();
