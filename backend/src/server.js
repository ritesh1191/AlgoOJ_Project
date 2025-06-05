const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const setupTempDirectory = require('./utils/setupTemp');
const dockerRunner = require('./utils/dockerRunner');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissionRoutes');
const codeExecutionRoutes = require('./routes/codeExecutionRoutes');

const app = express();

// Enable pre-flight requests for all routes
app.options('*', cors());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.68.60:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  // Allow requests from both localhost and network IP
  const allowedOrigins = ['http://localhost:3000', 'http://192.168.68.60:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Initialize Docker and temp directory
async function initialize() {
    try {
        await setupTempDirectory();
        await dockerRunner.initialize();
        console.log('Docker and temp directory initialization completed');
    } catch (error) {
        console.error('Initialization error:', error);
        process.exit(1);
    }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/algoj', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    initialize();
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/code', codeExecutionRoutes);

// 404 handler
app.use((req, res, next) => {
  if (!res.headersSent) {
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({
      message: 'Route not found',
      requestedMethod: req.method,
      requestedPath: req.path
    });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  if (!res.headersSent) {
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Cleanup on server shutdown
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Cleaning up...');
    await dockerRunner.stopContainer();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT. Cleaning up...');
    await dockerRunner.stopContainer();
    process.exit(0);
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Registered routes:');
  console.log('- /api/auth/*');
  console.log('- /api/problems/*');
  console.log('- /api/submissions/*');
  console.log('- /api/code/*');
}); 