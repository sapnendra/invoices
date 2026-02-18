require('dotenv').config(); // Load environment variables FIRST

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');

const connectDB = require('./config/database');
const invoiceRoutes = require('./routes/invoice.routes');
const authRoutes = require('./routes/auth.routes');
const { isAuthenticated } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy - Required for Render/Heroku to work with secure cookies
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Connect to MongoDB
connectDB();

// CORS configuration - Must be BEFORE other middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Session configuration - Must be BEFORE passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production', // Trust proxy for secure cookies
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600, // Update session once per 24 hours
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enable secure in production (HTTPS)
      sameSite: 'lax', // 'lax' works for same root domain (subdomains)
      path: '/', // Explicitly set path
      domain: process.env.NODE_ENV === 'production' ? '.sapnendra.tech' : undefined, // Share across subdomains
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware (after session)
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', isAuthenticated, invoiceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
