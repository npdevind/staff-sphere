// =============================================================================
// services/employeeService.js - Employee API Calls (Frontend)
// =============================================================================
//
// IMPORTANT: This is NOT the same as server/services/employeeService.js!
//   - server/services/employeeService.js → talks to the PostgreSQL database
//   - client/src/services/employeeService.js → talks to the Express API via HTTP
//
// PHP EQUIVALENT:
//   If you had a PHP frontend calling a PHP API, you'd use cURL or file_get_contents.
//   Here, we use Axios to make HTTP requests to our Express backend.
//   The React app never directly touches the database - it always goes through the API.
//
// DATA FLOW:
//   React Component → employeeService.getAll() → Axios HTTP GET → Express API
//   Express API → employeeService.getAllEmployees() → PostgreSQL → Express API
//   Express API → HTTP Response → Axios → employeeService.getAll() → React Component
// =============================================================================

import api from './api';

// =============================================================================
// GET ALL EMPLOYEES (with optional filters)
// =============================================================================
// params is an object like: { search: 'rahul', status: 'Active', department: 'HR' }
// Axios automatically converts this to query strings: ?search=rahul&status=Active
// =============================================================================
export const getEmployees = async (params = {}) => {
  // Remove empty string values so we don't send ?search=&status=
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  );
  const response = await api.get('/employees', { params: cleanParams });
  return response.data; // response.data is the JSON body from Express
};

// =============================================================================
// GET SINGLE EMPLOYEE BY ID
// =============================================================================
export const getEmployee = async (id) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

// =============================================================================
// CREATE NEW EMPLOYEE
// =============================================================================
// employeeData is an object with all the form fields
// Axios serializes it to JSON and sends it as the request body
// =============================================================================
export const createEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  return response.data;
};

// =============================================================================
// UPDATE EXISTING EMPLOYEE
// =============================================================================
export const updateEmployee = async (id, employeeData) => {
  const response = await api.put(`/employees/${id}`, employeeData);
  return response.data;
};

// =============================================================================
// DELETE EMPLOYEE
// =============================================================================
export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};

// =============================================================================
// GET EMPLOYEE STATISTICS (for dashboard cards)
// =============================================================================
export const getEmployeeStats = async () => {
  const response = await api.get('/employees/stats');
  return response.data;
};
