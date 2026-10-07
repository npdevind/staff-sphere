// =============================================================================
// pages/EmployeeForm.jsx - Add & Edit Employee Form Page
// =============================================================================
//
// This single component handles both ADD and EDIT operations.
// How do we know which mode we're in?
//   - If the URL is /employees/new → we're adding a new employee
//   - If the URL is /employees/5/edit → we're editing employee with ID 5
//
// We use the useParams() hook from React Router to get the ID from the URL.
//
// CONTROLLED FORMS IN REACT vs PHP FORMS:
//
//   PHP Form:
//     <form method="POST" action="/employees/create">
//       <input type="text" name="full_name" value="<?= $employee['full_name'] ?>">
//     </form>
//     When submitted: $_POST['full_name'] contains the value
//
//   React Controlled Form:
//     const [formData, setFormData] = useState({ full_name: '' });
//     <form onSubmit={handleSubmit}>
//       <input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
//     </form>
//     React's state always reflects what's in the input. No server round-trip.
//
// WHY CONTROLLED FORMS?
//   - You can validate in real-time as the user types
//   - You can programmatically set/clear values
//   - React is always in sync with the form state
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getEmployee, createEmployee, updateEmployee } from '../services/employeeService';
import { formatDateForInput, getErrorMessage, getFieldErrors, DEPARTMENTS, STATUS_OPTIONS } from '../utils/helpers';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

// Initial form state (all empty fields)
const INITIAL_FORM_DATA = {
  full_name:    '',
  email:        '',
  phone:        '',
  department:   '',
  designation:  '',
  joining_date: '',
  status:       'Active',
};

// =============================================================================
// FormField - Reusable form field with label and error message
// =============================================================================
const FormField = ({ label, required, error, children, id }) => (
  <div>
    <label htmlFor={id} className="form-label">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {/* Show field-specific validation error */}
    {error && (
      <p className="form-error" role="alert">
        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// =============================================================================
// EmployeeForm Component
// =============================================================================
const EmployeeForm = () => {
  // useParams extracts URL parameters
  // For /employees/5/edit, it returns { id: '5' }
  // For /employees/new, it returns {} (empty - no id param)
  const { id } = useParams();
  const navigate = useNavigate();

  // Is this an "edit" operation? (true) or "add" operation? (false)
  const isEditing = Boolean(id);

  // ========== STATE ==========
  const [formData, setFormData]     = useState(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState({}); // Validation errors per field
  const [isLoading, setIsLoading]   = useState(false); // Form submission in progress
  const [isFetching, setIsFetching] = useState(false); // Loading existing employee data
  const [fetchError, setFetchError] = useState(null);

  // ========== LOAD EXISTING EMPLOYEE DATA (for edit mode) ==========
  useEffect(() => {
    // If we have an ID in the URL, fetch the existing employee data
    // so we can pre-populate the form
    if (isEditing && id) {
      const fetchEmployee = async () => {
        setIsFetching(true);
        setFetchError(null);
        try {
          const response = await getEmployee(id);
          const employee = response.data;

          // Pre-populate the form with existing data
          // formatDateForInput converts "2022-03-15T00:00:00.000Z" to "2022-03-15"
          // because HTML date inputs only accept YYYY-MM-DD format
          setFormData({
            full_name:    employee.full_name   || '',
            email:        employee.email       || '',
            phone:        employee.phone       || '',
            department:   employee.department  || '',
            designation:  employee.designation || '',
            joining_date: formatDateForInput(employee.joining_date) || '',
            status:       employee.status      || 'Active',
          });
        } catch (err) {
          setFetchError(getErrorMessage(err));
        } finally {
          setIsFetching(false);
        }
      };

      fetchEmployee();
    }
  }, [id, isEditing]); // Re-run if id or isEditing changes

  // ========== HANDLE INPUT CHANGES ==========
  // A single generic change handler for all form fields
  // It uses the input's "name" attribute to know which field to update
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the specific field in formData (spread operator to keep other fields)
    // PHP equivalent: $_POST['full_name'] = $value;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear the validation error for this field as the user types
    // Good UX: errors disappear as the user corrects them
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ========== FRONTEND VALIDATION ==========
  // We validate BEFORE submitting to the API to give instant feedback
  // The backend ALSO validates (defense in depth)
  const validateForm = () => {
    const errors = {};

    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.department) {
      errors.department = 'Please select a department';
    }

    if (!formData.designation.trim()) {
      errors.designation = 'Designation / job title is required';
    }

    if (!formData.joining_date) {
      errors.joining_date = 'Joining date is required';
    }

    return errors;
  };

  // ========== FORM SUBMISSION ==========
  const handleSubmit = async (e) => {
    // Prevent the default browser form submission (which would reload the page)
    // PHP forms reload the page on submit - React prevents this and handles it in JS
    e.preventDefault();

    // Run frontend validation first
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to the top to show validation errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return; // Don't submit if there are errors
    }

    setIsLoading(true);
    setFieldErrors({});

    try {
      if (isEditing) {
        // UPDATE: PUT /api/employees/:id
        await updateEmployee(id, formData);
        toast.success('Employee updated successfully!');
      } else {
        // CREATE: POST /api/employees
        await createEmployee(formData);
        toast.success('Employee added successfully!');
      }

      // Navigate back to the employee list after success
      // PHP equivalent: header('Location: /employees');
      navigate('/employees');

    } catch (err) {
      // Check for field-specific errors from the API (e.g., duplicate email)
      const apiFieldErrors = getFieldErrors(err);
      if (Object.keys(apiFieldErrors).length > 0) {
        setFieldErrors(apiFieldErrors);
      } else {
        // Show a general error notification
        toast.error(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ========== RENDER ==========

  // Show loading state while fetching existing employee data (edit mode)
  if (isFetching) {
    return <Spinner text="Loading employee data..." />;
  }

  // Show error if employee couldn't be loaded (edit mode)
  if (fetchError) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={fetchError} />
        <Link to="/employees" className="btn-secondary">← Back to Employees</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header with breadcrumb navigation */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/employees" className="hover:text-primary-600">Employees</Link>
          <span>›</span>
          <span className="text-gray-900">{isEditing ? 'Edit Employee' : 'Add Employee'}</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? 'Update the employee information below'
            : 'Fill in the details below to add a new employee'}
        </p>
      </div>

      {/* ==========================================================================
          FORM CARD
          ========================================================================== */}
      <div className="card p-6">
        {/*
          onSubmit={handleSubmit}: When the form is submitted (button click or Enter),
          call handleSubmit. We call e.preventDefault() inside to stop page reload.
          
          PHP equivalent:
            <form method="POST" action="/employees/store">
          But in PHP, this sends data to a new URL and reloads the page.
          In React, handleSubmit manages everything in JavaScript.
        */}
        <form onSubmit={handleSubmit} noValidate id="employee-form">
          {/* noValidate: disables browser's built-in validation
              so our custom validation messages show instead */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Full Name */}
            <FormField
              id="full_name"
              label="Full Name"
              required
              error={fieldErrors.full_name}
            >
              <input
                type="text"
                id="full_name"
                name="full_name"           // Must match the key in formData
                value={formData.full_name}  // Controlled: React controls the value
                onChange={handleChange}     // Update state when user types
                placeholder="e.g. Rahul Sharma"
                className={`form-input ${fieldErrors.full_name ? 'form-input-error' : ''}`}
                autoComplete="name"
              />
            </FormField>

            {/* Email */}
            <FormField
              id="email"
              label="Email Address"
              required
              error={fieldErrors.email}
            >
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@company.com"
                className={`form-input ${fieldErrors.email ? 'form-input-error' : ''}`}
                autoComplete="email"
              />
            </FormField>

            {/* Phone */}
            <FormField
              id="phone"
              label="Phone Number"
              required
              error={fieldErrors.phone}
            >
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91-9876543210"
                className={`form-input ${fieldErrors.phone ? 'form-input-error' : ''}`}
                autoComplete="tel"
              />
            </FormField>

            {/* Department */}
            <FormField
              id="department"
              label="Department"
              required
              error={fieldErrors.department}
            >
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`form-input ${fieldErrors.department ? 'form-input-error' : ''}`}
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </FormField>

            {/* Designation */}
            <FormField
              id="designation"
              label="Designation / Job Title"
              required
              error={fieldErrors.designation}
            >
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className={`form-input ${fieldErrors.designation ? 'form-input-error' : ''}`}
              />
            </FormField>

            {/* Joining Date */}
            <FormField
              id="joining_date"
              label="Joining Date"
              required
              error={fieldErrors.joining_date}
            >
              <input
                type="date"
                id="joining_date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
                className={`form-input ${fieldErrors.joining_date ? 'form-input-error' : ''}`}
              />
            </FormField>

            {/* Status */}
            <FormField
              id="status"
              label="Employment Status"
              error={fieldErrors.status}
            >
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>

          </div>

          {/* Form action buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            {/* Cancel button - goes back to employee list */}
            <Link to="/employees" className="btn-secondary">
              Cancel
            </Link>

            {/* Submit button */}
            <button
              type="submit"
              id="employee-form-submit-btn"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  {isEditing ? 'Saving...' : 'Adding...'}
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEditing ? 'Save Changes' : 'Add Employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Learning tip box (helpful for junior devs) */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>💡 How this works:</strong> When you submit this form, React sends a JSON
          request via Axios to the Express API (<code>POST /api/employees</code> or{' '}
          <code>PUT /api/employees/:id</code>). The API validates the data, saves it to
          PostgreSQL, and returns the result. No page reload happens!
        </p>
      </div>
    </div>
  );
};

export default EmployeeForm;
