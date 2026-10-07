// =============================================================================
// pages/NotFound.jsx - 404 Page Not Found
// =============================================================================

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-6">
        <span className="text-4xl font-bold text-gray-400">404</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist. It may have been moved or deleted.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary">Go to Dashboard</Link>
        <Link to="/employees" className="btn-secondary">View Employees</Link>
      </div>
    </div>
  );
};

export default NotFound;
