// =============================================================================
// pages/EmployeeDetail.jsx - View Employee Details Page
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getEmployee, deleteEmployee } from '../services/employeeService';
import { formatDate, getErrorMessage } from '../utils/helpers';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';

// Helper: a single detail row (label + value pair)
const DetailRow = ({ label, value }) => (
  <div className="py-3 grid grid-cols-3 gap-4 border-b border-gray-100 last:border-b-0">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-sm text-gray-900 col-span-2">{value || '—'}</dd>
  </div>
);

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, isLoading: false });

  // Fetch employee data when the component mounts
  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEmployee(id);
        setEmployee(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, isLoading: true }));
    try {
      await deleteEmployee(id);
      toast.success('Employee deleted successfully');
      navigate('/employees');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleteDialog({ isOpen: false, isLoading: false });
    }
  };

  if (loading) return <Spinner text="Loading employee details..." />;
  if (error)   return <ErrorAlert message={error} />;
  if (!employee) return <ErrorAlert message="Employee not found" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/employees" className="hover:text-primary-600">Employees</Link>
        <span>›</span>
        <span className="text-gray-900">{employee.full_name}</span>
      </nav>

      {/* Profile header card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-primary-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-700">
              {employee.full_name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Name, title, status */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{employee.full_name}</h1>
            <p className="text-sm text-gray-600">{employee.designation} · {employee.department}</p>
            <div className="mt-2">
              <StatusBadge status={employee.status} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/employees/${employee.id}/edit`}
              id="view-edit-employee-btn"
              className="btn-secondary"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button
              type="button"
              id="view-delete-employee-btn"
              onClick={() => setDeleteDialog({ isOpen: true, isLoading: false })}
              className="btn-danger"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Details card */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Employee Information</h2>
        <dl>
          <DetailRow label="Employee ID"     value={`#${employee.id}`} />
          <DetailRow label="Full Name"       value={employee.full_name} />
          <DetailRow label="Email Address"   value={employee.email} />
          <DetailRow label="Phone Number"    value={employee.phone} />
          <DetailRow label="Department"      value={employee.department} />
          <DetailRow label="Designation"     value={employee.designation} />
          <DetailRow label="Joining Date"    value={formatDate(employee.joining_date)} />
          <DetailRow label="Status"          value={<StatusBadge status={employee.status} />} />
          <DetailRow label="Record Created"  value={formatDate(employee.created_at)} />
          <DetailRow label="Last Updated"    value={formatDate(employee.updated_at)} />
        </dl>
      </div>

      {/* Back link */}
      <Link to="/employees" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Employees
      </Link>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete "${employee.full_name}"?`}
        confirmText="Delete Employee"
        isLoading={deleteDialog.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, isLoading: false })}
      />
    </div>
  );
};

export default EmployeeDetail;
