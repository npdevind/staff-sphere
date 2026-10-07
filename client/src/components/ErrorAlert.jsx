// =============================================================================
// components/ErrorAlert.jsx - Error Alert Display Component
// =============================================================================
// Displays API or general errors in a user-friendly way.
// =============================================================================

const ErrorAlert = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4" role="alert">
      <div className="flex items-start gap-3">
        {/* Error icon */}
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>

          {/* Retry button (optional) */}
          {onRetry && (
            <button
              id="error-alert-retry-btn"
              type="button"
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-red-800 underline hover:no-underline"
            >
              Try again →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
