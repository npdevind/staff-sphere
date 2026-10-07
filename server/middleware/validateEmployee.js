// =============================================================================
// middleware/validateEmployee.js - Request Validation Middleware
// =============================================================================
//
// WHAT IS MIDDLEWARE?
//   Middleware is code that runs BETWEEN the incoming request and your route handler.
//   Think of it as a pipeline: Request → Middleware1 → Middleware2 → Route Handler → Response
//
// PHP EQUIVALENT:
//   In PHP, you'd typically validate inside the controller/function itself:
//     if (empty($_POST['email'])) { $errors[] = "Email is required"; }
//   
//   Or in a Laravel-style framework, you'd have Form Request classes.
//   Express middleware is similar to Laravel's Form Requests - validation logic
//   separated from controller logic.
//
// HOW EXPRESS MIDDLEWARE WORKS:
//   A middleware function receives (req, res, next):
//   - req: The incoming request (contains body, params, query, headers)
//   - res: The response object (use this to send data back to the client)
//   - next: Call this to pass control to the NEXT middleware or route handler
//
// USAGE IN ROUTES:
//   router.post('/', validateEmployee, employeeController.createEmployee)
//   The validation runs first; if it fails, we send an error and never call createEmployee.
// =============================================================================

// =============================================================================
// VALIDATE EMPLOYEE DATA (for both create and update)
// =============================================================================
const validateEmployee = (req, res, next) => {
  // req.body contains the JSON data sent by the client (React form submission)
  // PHP equivalent: $_POST or json_decode(file_get_contents('php://input'))
  const { full_name, email, phone, department, designation, joining_date, status } = req.body;

  // Object to collect all validation errors (field name → error message)
  const errors = {};

  // ----- Full Name Validation -----
  if (!full_name || full_name.trim().length === 0) {
    errors.full_name = 'Full name is required';
  } else if (full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters';
  } else if (full_name.trim().length > 150) {
    errors.full_name = 'Full name cannot exceed 150 characters';
  }

  // ----- Email Validation -----
  if (!email || email.trim().length === 0) {
    errors.email = 'Email address is required';
  } else {
    // Regular expression to validate email format
    // PHP equivalent: filter_var($email, FILTER_VALIDATE_EMAIL)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    } else if (email.trim().length > 255) {
      errors.email = 'Email cannot exceed 255 characters';
    }
  }

  // ----- Phone Validation -----
  if (!phone || phone.trim().length === 0) {
    errors.phone = 'Phone number is required';
  } else if (phone.trim().length > 20) {
    errors.phone = 'Phone number cannot exceed 20 characters';
  } else {
    // Allow digits, spaces, hyphens, plus signs, and parentheses
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!phoneRegex.test(phone.trim())) {
      errors.phone = 'Phone number can only contain digits, spaces, +, -, and ()';
    }
  }

  // ----- Department Validation -----
  if (!department || department.trim().length === 0) {
    errors.department = 'Department is required';
  } else if (department.trim().length > 100) {
    errors.department = 'Department cannot exceed 100 characters';
  }

  // ----- Designation Validation -----
  if (!designation || designation.trim().length === 0) {
    errors.designation = 'Designation / job title is required';
  } else if (designation.trim().length > 100) {
    errors.designation = 'Designation cannot exceed 100 characters';
  }

  // ----- Joining Date Validation -----
  if (!joining_date) {
    errors.joining_date = 'Joining date is required';
  } else {
    const date = new Date(joining_date);
    if (isNaN(date.getTime())) {
      errors.joining_date = 'Please enter a valid date';
    } else {
      // Date cannot be too far in the future (more than 1 year ahead)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      if (date > oneYearFromNow) {
        errors.joining_date = 'Joining date cannot be more than 1 year in the future';
      }
      // Date cannot be before year 1900
      if (date.getFullYear() < 1900) {
        errors.joining_date = 'Please enter a valid joining date';
      }
    }
  }

  // ----- Status Validation -----
  const validStatuses = ['Active', 'Inactive'];
  if (status && !validStatuses.includes(status)) {
    errors.status = 'Status must be either Active or Inactive';
  }

  // ----- Check for Validation Errors -----
  // If we collected any errors, send a 400 Bad Request response and STOP
  // We never call next() in this case, so the controller is never reached
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the errors below.',
      errors: errors,
    });
  }

  // ----- Sanitize Input -----
  // Trim whitespace from all string fields before passing to controller
  // This modifies req.body directly so the controller gets clean data
  req.body.full_name    = full_name.trim();
  req.body.email        = email.trim().toLowerCase(); // Store emails lowercase
  req.body.phone        = phone.trim();
  req.body.department   = department.trim();
  req.body.designation  = designation.trim();
  req.body.status       = status || 'Active'; // Default to Active if not provided

  // All validation passed! Call next() to move to the controller
  // PHP equivalent: If no errors, continue execution
  next();
};

module.exports = { validateEmployee };
