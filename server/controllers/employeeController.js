// =============================================================================
// controllers/employeeController.js - HTTP Request Handlers
// =============================================================================
//
// WHAT IS A CONTROLLER?
//   A controller handles the HTTP layer: reading request data, calling the
//   appropriate service, and sending back the response.
//
// PHP EQUIVALENT:
//   In PHP MVC (like Laravel), this is your Controller class:
//     class EmployeeController extends Controller {
//       public function index() { return Employee::all(); }
//       public function store(Request $request) { ... }
//     }
//
// HOW DATA FLOWS:
//   Client (React) → HTTP Request → Route → Middleware (validation) → Controller → Service → Database
//   Database → Service → Controller → HTTP Response → Client (React)
//
// SEPARATION OF CONCERNS:
//   - Routes:      Define WHICH URL maps to WHICH controller function
//   - Middleware:  Validate and sanitize input BEFORE the controller runs
//   - Controller:  Handle request/response, call services, handle errors
//   - Service:     Contain actual database queries and business logic
//   - Config/DB:   Manage database connections
//
// This separation makes the code easier to read, test, and maintain.
// =============================================================================

// Import the service layer that handles database operations
const employeeService = require('../services/employeeService');

// =============================================================================
// GET ALL EMPLOYEES
// GET /api/employees?search=rahul&status=Active&department=Engineering
// =============================================================================
// PHP equivalent:
//   function index() {
//     $employees = Employee::all();
//     echo json_encode($employees);
//   }
// =============================================================================
const getAllEmployees = async (req, res, next) => {
  try {
    // req.query contains URL query parameters
    // Example: /api/employees?search=rahul → req.query.search = 'rahul'
    // PHP equivalent: $_GET['search']
    const filters = {
      search:     req.query.search     || '',
      status:     req.query.status     || '',
      department: req.query.department || '',
    };

    // Call the service to get employees from the database
    const employees = await employeeService.getAllEmployees(filters);

    // Send back a successful JSON response
    // res.status(200) = HTTP 200 OK (default if you don't specify)
    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    // If anything goes wrong, pass the error to the global error handler
    // next(error) is the Express way; in PHP you might use throw or die()
    next(error);
  }
};

// =============================================================================
// GET SINGLE EMPLOYEE
// GET /api/employees/:id
// =============================================================================
const getEmployeeById = async (req, res, next) => {
  try {
    // req.params contains URL path parameters
    // Example: /api/employees/5 → req.params.id = '5' (string!)
    // PHP equivalent: $_GET['id'] or route parameter in frameworks
    const id = parseInt(req.params.id, 10);

    // Validate that the ID is a valid number
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID. Must be a positive number.',
      });
    }

    const employee = await employeeService.getEmployeeById(id);

    // If the service returns null, the employee doesn't exist
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} was not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// CREATE NEW EMPLOYEE
// POST /api/employees
// =============================================================================
// Note: Input validation is handled by validateEmployee middleware BEFORE this runs
// =============================================================================
const createEmployee = async (req, res, next) => {
  try {
    // req.body contains the JSON data sent in the request body
    // React sends this via axios.post('/api/employees', formData)
    // PHP equivalent: json_decode(file_get_contents('php://input'), true)
    const employeeData = req.body;

    // Check if the email already exists in the database
    const emailTaken = await employeeService.emailExists(employeeData.email);
    if (emailTaken) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email already exists',
        errors: { email: 'This email address is already registered' },
      });
    }

    // Create the employee in the database
    const newEmployee = await employeeService.createEmployee(employeeData);

    // HTTP 201 Created (not 200) is the correct code for resource creation
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee,
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// UPDATE EMPLOYEE
// PUT /api/employees/:id
// =============================================================================
const updateEmployee = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID. Must be a positive number.',
      });
    }

    // Check if employee exists before trying to update
    const existingEmployee = await employeeService.getEmployeeById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} was not found`,
      });
    }

    const employeeData = req.body;

    // Check for duplicate email - but exclude the current employee
    // Without excluding, updating without changing email would fail!
    const emailTaken = await employeeService.emailExists(employeeData.email, id);
    if (emailTaken) {
      return res.status(409).json({
        success: false,
        message: 'Another employee already has this email address',
        errors: { email: 'This email address is already registered to another employee' },
      });
    }

    const updatedEmployee = await employeeService.updateEmployee(id, employeeData);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// DELETE EMPLOYEE
// DELETE /api/employees/:id
// =============================================================================
const deleteEmployee = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID. Must be a positive number.',
      });
    }

    const deleted = await employeeService.deleteEmployee(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} was not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// GET EMPLOYEE STATISTICS (for dashboard cards)
// GET /api/employees/stats
// =============================================================================
const getEmployeeStats = async (req, res, next) => {
  try {
    const stats = await employeeService.getEmployeeStats();
    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// Export all controller functions
// =============================================================================
// PHP equivalent: public function index() {} - methods inside a class
// In Node.js, we export functions from a module
// =============================================================================
module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
};
