// =============================================================================
// components/StatusBadge.jsx - Employee Status Display Badge
// =============================================================================
// A reusable badge to display Active/Inactive status with color coding.
// =============================================================================

const StatusBadge = ({ status }) => {
  // Choose styles based on status value
  const isActive = status === 'Active';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800'  // Green for Active
          : 'bg-red-100 text-red-800'      // Red for Inactive
      }`}
    >
      {/* Colored dot indicator */}
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          isActive ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
