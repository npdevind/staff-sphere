// =============================================================================
// services/employeeService.js - Employee Database Operations (Business Logic)
// =============================================================================
//
// PHP EQUIVALENT:
//   This is similar to a PHP "Model" class or a set of functions that interact
//   with your database. In a PHP MVC app, you'd have something like Employee.php
//   with static methods like Employee::getAll(), Employee::findById($id), etc.
//
// WHY SEPARATE SERVICES FROM CONTROLLERS?
//   - Controllers handle HTTP request/response (what comes in, what goes out)
//   - Services handle business logic and database operations (the actual work)
//   - This separation makes the code easier to test and maintain
//   - If you switch databases later, you only change the service, not controllers
//
// HOW ASYNC/AWAIT WORKS (vs PHP):
//   PHP runs code synchronously - one line at a time, waiting for each to finish.
//   Node.js is asynchronous - it can do other things while waiting for DB queries.
//   'async' marks a function as asynchronous.
//   'await' pauses the function (not the whole server!) until a promise resolves.
//   This is how Node.js handles thousands of requests efficiently.
// =============================================================================

// Import the database connection pool
// This pool allows us to make SQL queries to PostgreSQL
const pool = require('../config/db');

// =============================================================================
// GET ALL EMPLOYEES
// =============================================================================
// Retrieves all employees from the database with optional search and filtering.
//
// PHP equivalent:
//   $stmt = $pdo->query("SELECT * FROM employees ORDER BY created_at DESC");
//   return $stmt->fetchAll(PDO::FETCH_ASSOC);
// =============================================================================
const getAllEmployees = async (filters = {}) => {
  const { search, status, department } = filters;

  // Start with a base SQL query
  // We build the WHERE clause dynamically based on which filters are provided
  let query = `
    SELECT 
      id,
      full_name,
      email,
      phone,
      department,
      designation,
      joining_date,
      status,
      created_at,
      updated_at
    FROM employees
    WHERE 1=1
  `;

  // Array to hold parameter values for parameterized queries
  // IMPORTANT: NEVER put user input directly into SQL strings!
  //   Bad:  "WHERE name = '" + name + "'"  <-- SQL Injection vulnerability!
  //   Good: "WHERE name = $1" with params = [name]  <-- Safe!
  //
  // PHP equivalent: $stmt->bindParam(':name', $name, PDO::PARAM_STR);
  const params = [];
  let paramIndex = 1; // PostgreSQL uses $1, $2, $3... for parameters

  // Add search filter if provided
  // ILIKE is PostgreSQL's case-insensitive LIKE
  // PHP MySQL equivalent: WHERE LOWER(full_name) LIKE LOWER('%search%')
  if (search) {
    query += ` AND (
      full_name ILIKE $${paramIndex} OR
      email ILIKE $${paramIndex} OR
      department ILIKE $${paramIndex}
    )`;
    params.push(`%${search}%`); // % is a wildcard: matches any characters
    paramIndex++;
  }

  // Add status filter if provided
  if (status && (status === 'Active' || status === 'Inactive')) {
    query += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  // Add department filter if provided
  if (department) {
    query += ` AND department ILIKE $${paramIndex}`;
    params.push(`%${department}%`);
    paramIndex++;
  }

  // Always sort by newest first
  query += ' ORDER BY created_at DESC';

  // Execute the query with parameterized values
  // pool.query() returns a Promise, so we use 'await' to wait for the result
  const result = await pool.query(query, params);

  // result.rows is an array of objects (like PHP's fetchAll(PDO::FETCH_ASSOC))
  return result.rows;
};

// =============================================================================
// GET EMPLOYEE BY ID
// =============================================================================
// Fetches a single employee by their ID.
//
// PHP equivalent:
//   $stmt = $pdo->prepare("SELECT * FROM employees WHERE id = :id");
//   $stmt->execute([':id' => $id]);
//   return $stmt->fetch(PDO::FETCH_ASSOC);
// =============================================================================
const getEmployeeById = async (id) => {
  const query = `
    SELECT 
      id,
      full_name,
      email,
      phone,
      department,
      designation,
      joining_date,
      status,
      created_at,
      updated_at
    FROM employees
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  // result.rows[0] is the first matching row (or undefined if not found)
  // PHP equivalent: $stmt->fetch() returns false if no row found
  return result.rows[0] || null;
};

// =============================================================================
// CREATE EMPLOYEE
// =============================================================================
// Inserts a new employee record into the database.
//
// PHP equivalent:
//   $stmt = $pdo->prepare("INSERT INTO employees (...) VALUES (...)");
//   $stmt->execute([...values...]);
//   return $pdo->lastInsertId();
// =============================================================================
const createEmployee = async (employeeData) => {
  const { full_name, email, phone, department, designation, joining_date, status } = employeeData;

  // RETURNING * tells PostgreSQL to return the newly inserted row
  // This is more efficient than doing a separate SELECT after INSERT
  // PHP + MySQL equivalent: INSERT INTO ...; then $pdo->lastInsertId() + another SELECT
  const query = `
    INSERT INTO employees (full_name, email, phone, department, designation, joining_date, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [full_name, email, phone, department, designation, joining_date, status || 'Active'];

  const result = await pool.query(query, values);

  // Return the newly created employee record (with ID, timestamps, etc.)
  return result.rows[0];
};

// =============================================================================
// UPDATE EMPLOYEE
// =============================================================================
// Updates an existing employee's information.
//
// PHP equivalent:
//   $stmt = $pdo->prepare("UPDATE employees SET ... WHERE id = :id");
//   $stmt->execute([...values...]);
// =============================================================================
const updateEmployee = async (id, employeeData) => {
  const { full_name, email, phone, department, designation, joining_date, status } = employeeData;

  // RETURNING * gives us the updated row without needing another SELECT
  // The trigger we set up in schema.sql will automatically update updated_at
  const query = `
    UPDATE employees
    SET 
      full_name    = $1,
      email        = $2,
      phone        = $3,
      department   = $4,
      designation  = $5,
      joining_date = $6,
      status       = $7
    WHERE id = $8
    RETURNING *
  `;

  const values = [full_name, email, phone, department, designation, joining_date, status, id];

  const result = await pool.query(query, values);

  // If rowCount is 0, the employee with that ID wasn't found
  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};

// =============================================================================
// DELETE EMPLOYEE
// =============================================================================
// Permanently removes an employee from the database.
//
// PHP equivalent:
//   $stmt = $pdo->prepare("DELETE FROM employees WHERE id = :id");
//   $stmt->execute([':id' => $id]);
//   return $stmt->rowCount() > 0;
// =============================================================================
const deleteEmployee = async (id) => {
  const query = 'DELETE FROM employees WHERE id = $1 RETURNING id';
  const result = await pool.query(query, [id]);

  // Return true if a row was deleted, false if the ID wasn't found
  return result.rowCount > 0;
};

// =============================================================================
// CHECK IF EMAIL EXISTS (for duplicate detection)
// =============================================================================
// Used to prevent two employees from having the same email address.
// We pass excludeId to allow email re-use when updating the same employee.
// =============================================================================
const emailExists = async (email, excludeId = null) => {
  let query = 'SELECT id FROM employees WHERE email = $1';
  const params = [email];

  // When editing, we need to exclude the current employee from the check
  // Otherwise you'd get a "duplicate email" error when saving without changing email
  if (excludeId) {
    query += ' AND id != $2';
    params.push(excludeId);
  }

  const result = await pool.query(query, params);
  return result.rows.length > 0;
};

// =============================================================================
// GET EMPLOYEE STATISTICS
// =============================================================================
// Returns summary counts used for the dashboard cards.
// =============================================================================
const getEmployeeStats = async () => {
  const query = `
    SELECT
      COUNT(*)                                          AS total,
      COUNT(*) FILTER (WHERE status = 'Active')        AS active,
      COUNT(*) FILTER (WHERE status = 'Inactive')      AS inactive,
      COUNT(DISTINCT department)                        AS departments
    FROM employees
  `;

  const result = await pool.query(query);

  // Parse the count values as integers (PostgreSQL returns them as strings)
  const row = result.rows[0];
  return {
    total:       parseInt(row.total, 10),
    active:      parseInt(row.active, 10),
    inactive:    parseInt(row.inactive, 10),
    departments: parseInt(row.departments, 10),
  };
};

// =============================================================================
// Export all service functions so controllers can use them
// =============================================================================
// PHP equivalent: public static function getAll() { ... }
// In Node.js, we export an object containing all our functions
// =============================================================================
module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  emailExists,
  getEmployeeStats,
};
