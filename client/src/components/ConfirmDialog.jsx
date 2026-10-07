// =============================================================================
// components/ConfirmDialog.jsx - Delete Confirmation Modal
// =============================================================================
//
// WHY A MODAL FOR DELETE?
//   Deleting is irreversible, so it's good UX to ask for confirmation.
//   This prevents accidental deletions.
//
// HOW REACT MODALS WORK:
//   A modal is just a component that renders on top of everything else.
//   We control its visibility with a boolean prop (isOpen).
//   When isOpen is false, we return null (render nothing).
//   When isOpen is true, we show the modal overlay and dialog.
//
// PHP EQUIVALENT:
//   In PHP, you'd redirect to a "confirm delete" page, then redirect back.
//   React handles this entirely in the browser without page reloads.
// =============================================================================

const ConfirmDialog = ({
  isOpen,          // Boolean: whether to show the dialog
  title,           // String: dialog title
  message,         // String: confirmation message
  onConfirm,       // Function: called when user clicks "Delete"
  onCancel,        // Function: called when user clicks "Cancel" or clicks outside
  confirmText = 'Delete',
  isLoading = false, // Show loading state while delete is in progress
}) => {
  // Don't render anything if the dialog is not open
  // This is a React pattern: conditionally render based on props
  if (!isOpen) return null;

  return (
    // Full-screen overlay (dark background)
    // The overlay covers the entire viewport and dims the background
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onCancel} // Click outside to cancel (good UX)
    >
      {/* Dialog box - centered white card */}
      {/* stopPropagation prevents clicks inside from closing the modal */}
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title || 'Confirm Delete'}</h3>
            <p className="text-sm text-gray-500 mt-1">{message || 'Are you sure you want to delete this record?'}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end mt-6">
          {/* Cancel button */}
          <button
            id="confirm-dialog-cancel-btn"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary"
          >
            Cancel
          </button>

          {/* Confirm (delete) button */}
          <button
            id="confirm-dialog-confirm-btn"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Deleting...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
