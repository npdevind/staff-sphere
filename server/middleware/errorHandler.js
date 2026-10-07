// =============================================================================
// middleware/errorHandler.js - Global Error Handler Middleware
// =============================================================================
//
// WHAT IS A GLOBAL ERROR HANDLER?
//   When something unexpected goes wrong in any route or middleware (like a
//   database connection failure), Express can forward the error to this special
//   error handling middleware instead of crashing the server.
//
//   You trigger it from any route by calling: next(error)
//   Express recognizes error-handling middleware by the 4 parameters: (err, req, res, next)
//
// PHP EQUIVALENT:
//   In PHP, you might use try/catch globally or set_error_handler() and
//   set_exception_handler(). This middleware plays a similar role.
//
// WHY THIS IS IMPORTANT:
//   - Prevents leaking sensitive error details (stack traces, SQL, file paths)
//     to the client in production
//   - Provides consistent error response format across all endpoints
//   - Centralizes error logging
// =============================================================================

const errorHandler = (err, req, res, next) => {
  // Log the error on the server side (only visible in server logs, not to users)
  console.error('⚠️  Unhandled Error:', err.message);

  // In development, log the full stack trace to help debug
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // =============================================================================
  // Handle Specific Known Error Types
  // =============================================================================

  // PostgreSQL unique constraint violation (e.g., duplicate email)
  // Error code 23505 is PostgreSQL's code for unique_violation
  if (err.code === '23505') {
    // Check which unique constraint was violated
    if (err.constraint && err.constraint.includes('email')) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email address already exists',
        errors: { email: 'This email is already registered' },
      });
    }
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry - this record already exists',
    });
  }

  // PostgreSQL check constraint violation (e.g., invalid status value)
  // Error code 23514 is PostgreSQL's code for check_violation
  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data - database constraint violation',
    });
  }

  // PostgreSQL connection errors
  if (err.code === 'ECONNREFUSED' || err.code === '57P03') {
    return res.status(503).json({
      success: false,
      message: 'Database is currently unavailable. Please try again later.',
    });
  }

  // Generic 500 Internal Server Error for all unhandled errors
  // IMPORTANT: Don't expose internal error details to the client in production!
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'An unexpected error occurred. Please try again later.';

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

// =============================================================================
// 404 Handler - for routes that don't exist
// =============================================================================
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
  });
};

module.exports = { errorHandler, notFoundHandler };
