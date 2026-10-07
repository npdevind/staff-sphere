// =============================================================================
// pages/Dashboard.jsx - Dashboard / Home Page
// =============================================================================
//
// This page shows a summary of all employees using stat cards.
// It's the first page users see when they open the app.
//
// WHAT YOU LEARN HERE:
//   - How to fetch data with a custom hook
//   - How to render conditional UI (loading, error, data)
//   - How to display data in cards
//   - How to use React Router's <Link> for navigation
// =============================================================================

import { Link } from 'react-router-dom';
import useEmployees from '../hooks/useEmployees';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/helpers';

// =============================================================================
// StatCard - A reusable summary card for the dashboard
// =============================================================================
// This is a component defined inside the same file.
// You can do this for components that are only used in one place.
// =============================================================================
const StatCard = ({ title, value, icon, colorClass, description }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${colorClass}`}>
          {value ?? '—'}
        </p>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className={`flex items-center justify-center h-12 w-12 rounded-xl ${colorClass.replace('text-', 'bg-').replace('-700', '-100').replace('-800', '-100')}`}>
        {icon}
      </div>
    </div>
  </div>
);

// =============================================================================
// Dashboard Page Component
// =============================================================================
const Dashboard = () => {
  // Fetch employee data using our custom hook
  // The hook returns employees, stats (totals), loading state, and error
  const { employees, stats, loading, error, refetch } = useEmployees();

  // Show loading indicator while fetching data
  if (loading) {
    return <Spinner size="lg" text="Loading dashboard data..." />;
  }

  // Show error if the API call failed
  if (error) {
    return <ErrorAlert message={error} onRetry={refetch} />;
  }

  // Get only the 5 most recent employees for the "Recent Employees" table
  const recentEmployees = employees.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to StaffSphere. Here's an overview of your workforce.
        </p>
      </div>

      {/* =================================================================
          STAT CARDS - Summary numbers
          ================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats?.total ?? employees.length}
          colorClass="text-primary-700"
          description="All employees"
          icon={
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Active Employees"
          value={stats?.active}
          colorClass="text-green-700"
          description="Currently working"
          icon={
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Inactive Employees"
          value={stats?.inactive}
          colorClass="text-red-700"
          description="Not currently active"
          icon={
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Departments"
          value={stats?.departments}
          colorClass="text-purple-700"
          description="Active departments"
          icon={
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      {/* =================================================================
          RECENT EMPLOYEES TABLE
          ================================================================= */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Recent Employees</h2>
          <Link to="/employees" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        {recentEmployees.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">No employees found.</p>
            <Link to="/employees/new" className="mt-2 inline-block text-sm text-primary-600 hover:underline">
              Add your first employee
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Department</th>
                  <th className="table-header">Designation</th>
                  <th className="table-header">Joining Date</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* 
                  .map() is the React way to render a list.
                  PHP equivalent: foreach ($employees as $employee) { echo "<tr>...</tr>"; }
                  Each child in a list needs a unique "key" prop for React to track them.
                */}
                {recentEmployees.map((employee) => (
                  <tr key={employee.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        {/* Avatar initial */}
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-700">
                            {employee.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{employee.full_name}</p>
                          <p className="text-xs text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-gray-600">{employee.department}</td>
                    <td className="table-cell text-gray-600">{employee.designation}</td>
                    <td className="table-cell text-gray-600">{formatDate(employee.joining_date)}</td>
                    <td className="table-cell">
                      <StatusBadge status={employee.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/employees/new" className="btn-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Employee
          </Link>
          <Link to="/employees" className="btn-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All Employees
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
