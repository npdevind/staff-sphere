// =============================================================================
// server.js - HTTP Server Entry Point
// =============================================================================
//
// WHAT IS THIS FILE?
//   This is the entry point for starting the Node.js HTTP server.
//   Run this file to start the backend: node server.js
//
// PHP EQUIVALENT:
//   In PHP, Apache/Nginx IS the HTTP server - it starts automatically and
//   runs your PHP files when requests come in. You don't write a "start server" file.
//   
//   In Node.js, YOU create the HTTP server in code.
//   This is one of the fundamental differences between PHP and Node.js.
//   Node.js is a runtime that runs your code as a long-lived process,
//   while PHP typically starts fresh on every request.
//
// APP.JS vs SERVER.JS:
//   app.js    → Configures Express (middleware, routes) - the "what"
//   server.js → Starts the HTTP server on a port - the "how to run it"
//   This is a common pattern. It keeps configuration and startup separate.
// =============================================================================

// Load the configured Express application
const app = require('./app');

// Read the port from environment variables, fall back to 5000
// This allows deployment platforms (Heroku, Railway, etc.) to set the port
// PHP equivalent: In Apache, ports are configured in httpd.conf, not in PHP files
const PORT = parseInt(process.env.PORT || '5000', 10);

// =============================================================================
// Start the HTTP Server
// =============================================================================
// app.listen() starts the server and makes it listen for incoming connections
// It returns a server object that we store to handle graceful shutdown
// =============================================================================
const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║        StaffSphere API Server              ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║  Server:  http://localhost:${PORT}             ║`);
  console.log(`║  Health:  http://localhost:${PORT}/api/health  ║`);
  console.log(`║  Mode:    ${(process.env.NODE_ENV || 'development').padEnd(33)}║`);
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
});

// =============================================================================
// GRACEFUL SHUTDOWN
// =============================================================================
// When the server receives a shutdown signal (Ctrl+C or system shutdown),
// we want to finish handling current requests before stopping.
//
// PHP equivalent: register_shutdown_function() or signal handlers
//
// SIGTERM: Signal sent by process managers (like PM2) to request graceful shutdown
// SIGINT:  Signal sent when user presses Ctrl+C in the terminal
// =============================================================================
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('👋 StaffSphere API stopped');
    process.exit(0);
  });

  // Force shutdown if graceful close takes too long (10 seconds)
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections (async errors not caught with try/catch)
// PHP equivalent: set_exception_handler()
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Promise Rejection:', reason);
  // In production, you'd want to gracefully restart the server here
});

// Handle uncaught synchronous exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1); // Crash and let the process manager restart the server
});
