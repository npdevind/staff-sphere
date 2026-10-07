// =============================================================================
// app.js - Express Application Setup
// =============================================================================
//
// WHAT IS app.js?
//   This file creates and configures the Express application.
//   It's like the "bootstrap" file in PHP frameworks (like index.php in Laravel
//   or CodeIgniter's index.php). It:
//   1. Creates the Express app
//   2. Configures global middleware (CORS, JSON parsing, etc.)
//   3. Registers all routes
//   4. Sets up error handling
//
// PHP EQUIVALENT CONCEPTS:
//   Express app         ≈ PHP $_SERVER + your routing system
//   app.use(middleware) ≈ PHP filters/hooks applied to every request
//   app.use('/api', router) ≈ include/require your routing file
//   express.json()      ≈ json_decode(file_get_contents('php://input'))
//
// SEPARATION: app.js vs server.js
//   app.js:    Creates and configures the Express app (no server listening)
//   server.js: Starts the actual HTTP server using the configured app
//   This separation makes it easier to test the app without starting a server.
// =============================================================================

require('dotenv').config(); // Load .env variables first

const express = require('express');
const cors = require('cors');

// Import route handlers
const employeeRoutes = require('./routes/employeeRoutes');

// Import error handling middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import database connection (this triggers the connection test on startup)
const pool = require('./config/db');

// =============================================================================
// Create the Express Application
// =============================================================================
const app = express();

// =============================================================================
// CORS Configuration
// =============================================================================
// CORS = Cross-Origin Resource Sharing
// Browsers block requests from one origin (e.g., localhost:5173) to another
// origin (e.g., localhost:5000) by default, for security reasons.
// We need to explicitly allow our React frontend to talk to this API.
//
// PHP equivalent:
//   header('Access-Control-Allow-Origin: http://localhost:5173');
//   header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
//   header('Access-Control-Allow-Headers: Content-Type');
// =============================================================================
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// =============================================================================
// Body Parser Middleware
// =============================================================================
// These middleware functions parse incoming request bodies so we can access
// the data as JavaScript objects via req.body.
//
// express.json() → parses requests with Content-Type: application/json
// PHP equivalent: json_decode(file_get_contents('php://input'), true)
//
// express.urlencoded() → parses HTML form submissions
// PHP equivalent: $_POST data
// =============================================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================================================
// Request Logger (Development Only)
// =============================================================================
// Logs each incoming request to the console for debugging.
// In production, you'd use a proper logging library like Winston or Morgan.
// PHP equivalent: error_log($_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI']);
// =============================================================================
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next(); // Always call next() to continue to the next middleware
  });
}

// =============================================================================
// ROUTES
// =============================================================================
// Mount all our route handlers at their respective URL prefixes.
// app.use('/api/employees', employeeRoutes) means:
//   - Any request to /api/employees/* will be handled by employeeRoutes
//   - Inside employeeRoutes, paths are relative (so '/' = '/api/employees')
//
// PHP equivalent:
//   include 'routes/employees.php'; // with URL matching handled manually
//   // Or in Laravel: Route::apiResource('employees', EmployeeController::class);
// =============================================================================

// Health check endpoint - useful to verify the server is running
// This is commonly used by monitoring tools and deployment systems
app.get('/api/health', async (req, res) => {
  let dbStatus = 'connected';

  try {
    // Try a simple database query to verify DB is accessible
    await pool.query('SELECT 1');
  } catch (err) {
    dbStatus = 'disconnected';
  }

  res.status(200).json({
    success: true,
    message: 'StaffSphere API is running',
    data: {
      status:      'healthy',
      database:    dbStatus,
      environment: process.env.NODE_ENV || 'development',
      timestamp:   new Date().toISOString(),
      version:     '1.0.0',
    },
  });
});

// Mount employee routes
app.use('/api/employees', employeeRoutes);

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================
// These MUST be registered AFTER all routes.
// Order matters in Express middleware!
// =============================================================================

// Handle requests to undefined routes (404)
app.use(notFoundHandler);

// Handle all errors passed via next(error) in controllers
// Note the 4 parameters: Express identifies error handlers by signature (err, req, res, next)
app.use(errorHandler);

// =============================================================================
// Export the configured app
// =============================================================================
// server.js will import this and start listening for connections
// =============================================================================
module.exports = app;
