// =============================================================================
// pages/EmployeeList.jsx - Employee List Page with Search, Filter, and CRUD
// =============================================================================
//
// This is the main employee management page. It shows all employees in a
// table with search/filter functionality, and links to add, view, edit, delete.
//
// WHAT YOU LEARN HERE:
//   - useState for managing local UI state (search term, filters, which dialog is open)
//   - useEffect for watching state changes (debounced search)
//   - Custom hooks for data fetching
//   - Controlled inputs (React's way of handling form elements)
//   - Conditional rendering
//   - List rendering with .map()
//   - Event handlers
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import useEmployees from '../hooks/useEmployees';
import { deleteEmployee } from '../services/employeeService';
import { formatDate, getErrorMessage, DEPARTMENTS, STATUS_OPTIONS, debounce } from '../utils/helpers';

import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

const EmployeeList = () => {
  // React Router hook for programmatic navigation
  // PHP equivalent: header('Location: /employees');
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT
  // All these variables control the UI and data flow
  // ==========================================================================

  // Search and filter state
  // useState returns [currentValue, setterFunction]
  // When you call the setter, React re-renders the component with the new value
  const [searchInput, setSearchInput]     = useState(''); // What the user typed
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Delayed search sent to API
  const [statusFilter, setStatusFilter]   = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen:     false,
    employeeId: null,
    employeeName: '',
    isLoading:  false,
  });

  // ==========================================================================
  // DEBOUNCED SEARCH
  // We don't want to call the API on every single keystroke.
  // After the user stops typing for 500ms, then we update the actual search query.
  // ==========================================================================
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((value) => setDebouncedSearch(value), 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchInput);
  }, [searchInput, debouncedSetSearch]);

  // ==========================================================================
  // FETCH DATA using custom hook
  // We pass the current filters so the hook re-fetches when filters change
  // ==========================================================================
  const { employees, loading, error, refetch } = useEmployees({
    search:     debouncedSearch,
    status:     statusFilter,
    department: departmentFilter,
  });

  // ==========================================================================
  // DELETE EMPLOYEE
  // ==========================================================================
  const handleDeleteClick = (employee) => {
    // Open the confirmation dialog (not actually deleting yet!)
    setDeleteDialog({
      isOpen:       true,
      employeeId:   employee.id,
      employeeName: employee.full_name,
      isLoading:    false,
    });
  };

  const handleDeleteConfirm = async () => {
    // Set loading state on the button
    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      // Call the delete API
      await deleteEmployee(deleteDialog.employeeId);

      // Show success notification
      // toast() is from react-toastify - shows a popup notification
      toast.success(`${deleteDialog.employeeName} has been deleted successfully`);

      // Close the dialog
      setDeleteDialog({ isOpen: false, employeeId: null, employeeName: '', isLoading: false });

      // Refresh the employee list
      refetch();

    } catch (err) {
      // Show error notification if delete failed
      toast.error(getErrorMessage(err));
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, employeeId: null, employeeName: '', isLoading: false });
  };

  // ==========================================================================
  // CLEAR FILTERS
  // ==========================================================================
  const clearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setStatusFilter('');
    setDepartmentFilter('');
  };

  const hasActiveFilters = searchInput || statusFilter || departmentFilter;

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Loading...' : `${employees.length} employee${employees.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        {/* Add employee button */}
        <Link to="/employees/new" id="add-employee-btn" className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </Link>
      </div>

      {/* ====================================================================
          SEARCH & FILTER BAR
          ==================================================================== */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search input */}
          {/*
            CONTROLLED INPUTS in React:
            The input's value is controlled by React state (value={searchInput}).
            When the user types, onChange fires and updates the state.
            React re-renders the input with the new value.
            
            PHP equivalent:
              <input type="text" value="<?= htmlspecialchars($_GET['search'] ?? '') ?>">
            But in PHP, this requires a page reload to take effect.
            In React, the page updates instantly without a reload.
          */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="employee-search-input"
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)} // Update state on every keystroke
              className="form-input pl-9"
            />
          </div>

          {/* Status filter dropdown */}
          <select
            id="employee-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input lg:w-40"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Department filter dropdown */}
          <select
            id="employee-department-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="form-input lg:w-48"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Clear filters button - only shown when filters are active */}
          {hasActiveFilters && (
            <button
              id="clear-filters-btn"
              type="button"
              onClick={clearFilters}
              className="btn-secondary whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ====================================================================
          ERROR MESSAGE
          ==================================================================== */}
      {error && <ErrorAlert message={error} onRetry={refetch} />}

      {/* ====================================================================
          EMPLOYEE TABLE
          ==================================================================== */}
      <div className="card">
        {loading ? (
          <Spinner text="Fetching employees..." />
        ) : employees.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'No matching employees' : 'No employees yet'}
            message={
              hasActiveFilters
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by adding your first employee to the system.'
            }
            actionLabel={hasActiveFilters ? 'Clear Filters' : 'Add First Employee'}
            onAction={hasActiveFilters ? clearFilters : () => navigate('/employees/new')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" id="employees-table">
              <thead>
                <tr>
                  <th className="table-header">Employee</th>
                  <th className="table-header hidden md:table-cell">Department</th>
                  <th className="table-header hidden lg:table-cell">Designation</th>
                  <th className="table-header hidden lg:table-cell">Joining Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                    {/* Employee name + email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-700">
                            {employee.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{employee.full_name}</p>
                          <p className="text-xs text-gray-500 truncate">{employee.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="table-cell text-gray-600 hidden md:table-cell">{employee.department}</td>
                    <td className="table-cell text-gray-600 hidden lg:table-cell">{employee.designation}</td>
                    <td className="table-cell text-gray-600 hidden lg:table-cell">{formatDate(employee.joining_date)}</td>

                    <td className="table-cell">
                      <StatusBadge status={employee.status} />
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* View button */}
                        <Link
                          to={`/employees/${employee.id}`}
                          id={`view-employee-${employee.id}-btn`}
                          title="View Details"
                          className="btn-icon text-gray-500 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>

                        {/* Edit button */}
                        <Link
                          to={`/employees/${employee.id}/edit`}
                          id={`edit-employee-${employee.id}-btn`}
                          title="Edit Employee"
                          className="btn-icon text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>

                        {/* Delete button */}
                        <button
                          type="button"
                          id={`delete-employee-${employee.id}-btn`}
                          title="Delete Employee"
                          onClick={() => handleDeleteClick(employee)}
                          className="btn-icon text-gray-500 hover:text-red-600 hover:bg-red-50 focus:ring-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====================================================================
          DELETE CONFIRMATION DIALOG
          ==================================================================== */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteDialog.employeeName}"? This action cannot be undone.`}
        confirmText="Delete Employee"
        isLoading={deleteDialog.isLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default EmployeeList;
