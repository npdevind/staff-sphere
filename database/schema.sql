-- =============================================================================
-- StaffSphere - Employee Management System
-- Database Schema
-- =============================================================================
-- HOW TO USE THIS FILE:
--   1. Open your terminal / psql shell
--   2. Connect to PostgreSQL: psql -U postgres
--   3. Create the database: CREATE DATABASE employee_management;
--   4. Connect to it: \c employee_management
--   5. Run this file: \i /path/to/database/schema.sql
--
-- Or run directly from terminal:
--   psql -U postgres -d employee_management -f database/schema.sql
-- =============================================================================

-- Create the database (run this separately if you haven't already):
-- CREATE DATABASE employee_management;

-- Connect to the database:
-- \c employee_management

-- =============================================================================
-- EMPLOYEES TABLE
-- =============================================================================
-- This is the main table that stores all employee records.
-- In PHP + MySQL, you'd write: CREATE TABLE employees (...)
-- In PostgreSQL, the syntax is almost identical, just a few differences:
--   - SERIAL is PostgreSQL's auto-increment (like AUTO_INCREMENT in MySQL)
--   - TIMESTAMPTZ stores timestamps with timezone info
--   - CHECK constraints validate values at the database level
-- =============================================================================

CREATE TABLE IF NOT EXISTS employees (
    -- Primary key: auto-incrementing unique ID for each employee
    -- PHP equivalent: id INT AUTO_INCREMENT PRIMARY KEY
    id SERIAL PRIMARY KEY,

    -- Employee's full name (required, max 150 characters)
    full_name VARCHAR(150) NOT NULL,

    -- Email address - must be unique across all employees
    -- The UNIQUE constraint prevents two employees with the same email
    email VARCHAR(255) NOT NULL UNIQUE,

    -- Phone number stored as text so we can include formatting like +91-9876543210
    phone VARCHAR(20) NOT NULL,

    -- Department the employee belongs to (e.g., Engineering, HR, Sales)
    department VARCHAR(100) NOT NULL,

    -- Job title / role (e.g., Software Engineer, Manager)
    designation VARCHAR(100) NOT NULL,

    -- Date when the employee joined the company (DATE stores only the date, no time)
    joining_date DATE NOT NULL,

    -- Employment status: must be either 'Active' or 'Inactive'
    -- CHECK constraint is a database-level validation rule
    -- This means even if the API tries to insert invalid data, the DB will reject it
    status VARCHAR(20) NOT NULL DEFAULT 'Active'
        CONSTRAINT employees_status_check CHECK (status IN ('Active', 'Inactive')),

    -- Audit timestamps: automatically track when each record was created/modified
    -- TIMESTAMPTZ = Timestamp with Time Zone (recommended over plain TIMESTAMP)
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES
-- =============================================================================
-- Indexes speed up database queries, similar to a book's index.
-- Without indexes, PostgreSQL must scan every row to find matches (slow for large tables).
-- With indexes, it can jump directly to the relevant rows (fast).
-- =============================================================================

-- Index on email for fast lookup when checking duplicates
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- Index on department for fast filtering by department
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);

-- Index on status for fast filtering by Active/Inactive
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

-- =============================================================================
-- TRIGGER FUNCTION: Auto-update the updated_at timestamp
-- =============================================================================
-- In PHP, you'd manually set updated_at = NOW() in every UPDATE query.
-- In PostgreSQL, we can use a trigger to do this automatically.
-- A trigger is code that runs automatically when a specific database event occurs.
-- =============================================================================

-- Create a reusable function that sets updated_at to the current timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- NEW refers to the new row being inserted/updated
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the function to the employees table as a trigger
-- BEFORE UPDATE means the function runs BEFORE the update is saved
DROP TRIGGER IF EXISTS set_employees_updated_at ON employees;
CREATE TRIGGER set_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SAMPLE DATA (Optional - for testing purposes)
-- =============================================================================
-- Uncomment the lines below to insert sample employees for testing.
-- This is like PHP's database seeding.
-- =============================================================================

INSERT INTO employees (full_name, email, phone, department, designation, joining_date, status)
VALUES
    ('Rahul Sharma',    'rahul.sharma@staffsphere.com',    '+91-9876543210', 'Engineering',   'Senior Software Engineer', '2022-03-15', 'Active'),
    ('Priya Patel',     'priya.patel@staffsphere.com',     '+91-9876543211', 'HR',            'HR Manager',               '2021-07-01', 'Active'),
    ('Amit Verma',      'amit.verma@staffsphere.com',      '+91-9876543212', 'Sales',         'Sales Executive',          '2023-01-10', 'Active'),
    ('Sneha Iyer',      'sneha.iyer@staffsphere.com',      '+91-9876543213', 'Engineering',   'Junior Developer',         '2023-06-20', 'Active'),
    ('Vikram Singh',    'vikram.singh@staffsphere.com',    '+91-9876543214', 'Finance',       'Financial Analyst',        '2020-11-05', 'Inactive'),
    ('Ananya Desai',    'ananya.desai@staffsphere.com',    '+91-9876543215', 'Marketing',     'Marketing Specialist',     '2022-09-12', 'Active'),
    ('Ravi Kumar',      'ravi.kumar@staffsphere.com',      '+91-9876543216', 'Operations',    'Operations Manager',       '2019-04-22', 'Active'),
    ('Kavya Reddy',     'kavya.reddy@staffsphere.com',     '+91-9876543217', 'Engineering',   'DevOps Engineer',          '2023-03-08', 'Active');

-- =============================================================================
-- VERIFY SETUP
-- =============================================================================
-- After running this file, you can verify by running:
--   SELECT * FROM employees;
--   SELECT COUNT(*) FROM employees;
-- =============================================================================
