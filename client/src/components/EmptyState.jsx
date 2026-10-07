// =============================================================================
// components/EmptyState.jsx - Empty State Display Component
// =============================================================================
// Shown when there are no employees to display.
// Good UX practice: always show a helpful message instead of a blank table.
// =============================================================================

const EmptyState = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration icon */}
      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-4">
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {title || 'No employees found'}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
        {message || 'Get started by adding your first employee to the system.'}
      </p>

      {/* Optional action button */}
      {onAction && actionLabel && (
        <button
          id="empty-state-action-btn"
          type="button"
          onClick={onAction}
          className="btn-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
