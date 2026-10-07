// =============================================================================
// config/db.js - PostgreSQL Database Connection Configuration
// =============================================================================
//
// PHP EQUIVALENT:
//   In PHP + PDO you would write:
//     $pdo = new PDO("pgsql:host=localhost;dbname=mydb", $user, $pass);
//
//   In PHP + MySQLi:
//     $conn = new mysqli($host, $user, $pass, $dbname);
//
// In Node.js with the 'pg' package, we use a "Pool" of connections.
// A Pool maintains multiple reusable connections so our app can handle
// multiple requests simultaneously without creating a new DB connection
// on every single request (which is slow and wastes resources).
//
// FLOW:
//   1. This file reads database credentials from environment variables (.env)
//   2. Creates a connection pool using those credentials
//   3. Exports the pool so other files (controllers, services) can use it
//   4. Other files import this: const pool = require('../config/db')
//      Then query: const result = await pool.query('SELECT * FROM employees')
// =============================================================================

// Load environment variables from the .env file into process.env
// This must be called before accessing any process.env variables
require('dotenv').config();

// Import the Pool class from the 'pg' (node-postgres) package
// Pool manages multiple database connections efficiently
const { Pool } = require('pg');

// =============================================================================
// Create the Connection Pool
// =============================================================================
// We read credentials from environment variables (not hardcoded!)
// Never hardcode passwords in your code - they end up in version control.
// =============================================================================
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',  // Database server address
  port:     parseInt(process.env.DB_PORT || '5432'), // PostgreSQL default port
  database: process.env.DB_NAME     || 'employee_management',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD,

  // Connection pool settings:
  max: 10,                // Maximum number of connections to keep open
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Fail if can't connect within 2 seconds
});

// =============================================================================
// Test the Connection on Startup
// =============================================================================
// When the server starts, we immediately try to connect to verify
// the database is reachable and credentials are correct.
//
// PHP equivalent: if (!$conn) { die("Connection failed: " . $conn->connect_error); }
// =============================================================================
pool.connect((err, client, release) => {
  if (err) {
    // Log a clear error message if the connection fails
    console.error('❌ Database connection failed!');
    console.error('   Error:', err.message);
    console.error('   Check your .env file - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
    // Note: We don't exit the process here so the health endpoint can still report the issue
  } else {
    console.log('✅ PostgreSQL database connected successfully!');
    console.log(`   Connected to: ${process.env.DB_NAME || 'employee_management'} @ ${process.env.DB_HOST || 'localhost'}`);
    release(); // Return the connection back to the pool (important!)
  }
});

// =============================================================================
// Export the pool so other files can use it
// =============================================================================
// PHP equivalent: include 'config/db.php';
// Node.js uses CommonJS modules: require('./config/db')
// =============================================================================
module.exports = pool;
