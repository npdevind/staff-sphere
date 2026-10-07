// =============================================================================
// routes/employeeRoutes.js - API Route Definitions
// =============================================================================
//
// WHAT ARE ROUTES?
//   Routes map URLs (and HTTP methods) to controller functions.
//   When a request comes in, Express matches it to a route and calls the handler.
//
// PHP EQUIVALENT:
//   In plain PHP, you might have separate files: employees/index.php, employees/create.php
//   In Laravel, you'd define routes in routes/api.php:
//     Route::get('/employees', [EmployeeController::class, 'index']);
//     Route::post('/employees', [EmployeeController::class, 'store']);
//   This file is the Node.js / Express equivalent.
//
// HTTP METHODS (same in both PHP and Node.js):
//   GET    = Retrieve data (safe, no side effects)
//   POST   = Create new data
//   PUT    = Replace/update existing data
//   DELETE = Remove data
//
// ROUTE PARAMS vs QUERY STRINGS:
//   Route param:   /api/employees/5       → req.params.id = '5'
//   Query string:  /api/employees?search=rahul → req.query.search = 'rahul'
// =============================================================================

const express = require('express');

// express.Router() creates a modular, mountable route handler
// Think of it as a mini Express app for a specific section of the URL tree
// We mount this router in app.js at '/api/employees'
const router = express.Router();

// Import the controller functions that handle the business logic
const employeeController = require('../controllers/employeeController');

// Import validation middleware - runs before the controller for POST and PUT
const { validateEmployee } = require('../middleware/validateEmployee');

// =============================================================================
// ROUTE DEFINITIONS
// =============================================================================
// Note: The full URL for each route is: BASE_URL + '/api/employees' + path below
// =============================================================================

// GET  /api/employees/stats  - Get dashboard statistics
// IMPORTANT: This must be defined BEFORE the /:id route!
// If you put it after, Express would try to match 'stats' as an ID.
router.get('/stats', employeeController.getEmployeeStats);

// GET  /api/employees         - Get all employees (with optional search/filter)
router.get('/', employeeController.getAllEmployees);

// GET  /api/employees/:id     - Get a single employee by ID
// :id is a route parameter - it matches any value in that URL segment
router.get('/:id', employeeController.getEmployeeById);

// POST /api/employees         - Create a new employee
// validateEmployee runs FIRST: if validation fails, controller is never called
router.post('/', validateEmployee, employeeController.createEmployee);

// PUT  /api/employees/:id     - Update an existing employee
// validateEmployee runs FIRST to check the updated data
router.put('/:id', validateEmployee, employeeController.updateEmployee);

// DELETE /api/employees/:id  - Delete an employee
router.delete('/:id', employeeController.deleteEmployee);

// Export the router to be used in app.js
module.exports = router;
