// =============================================================================
// utils/helpers.js - Utility / Helper Functions
// =============================================================================
//
// These are pure functions (no side effects) that perform common tasks.
// PHP equivalent: A helpers.php file included at the top of your project.
// In Node.js/React, we use ES module exports instead of PHP includes.
// =============================================================================

// =============================================================================
// FORMAT DATE for display (e.g., "March 15, 2022")
// =============================================================================
// PHP equivalent: date('F j, Y', strtotime($date))
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    });
  } catch {
    return dateString;
  }
};

// Format date for input[type="date"] (e.g., "2022-03-15")
// HTML date inputs require the format YYYY-MM-DD
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Extract year, month, day and zero-pad month/day
    const year  = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed!
    const day   = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

// =============================================================================
// TRUNCATE TEXT (for long strings in tables)
// =============================================================================
// PHP equivalent: substr($text, 0, $maxLength) . '...'
export const truncate = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// =============================================================================
// EXTRACT ERROR MESSAGE from an Axios error response
// =============================================================================
// Axios wraps HTTP errors in an error object. We need to extract
// the useful message from the server's JSON response.
//
// Error structure from our Express API:
//   { success: false, message: "...", errors: { field: "..." } }
// =============================================================================
export const getErrorMessage = (error) => {
  // Check if there's a response from the server (not a network error)
  if (error.response) {
    const { data, status } = error.response;

    // Use the server's message if available
    if (data && data.message) {
      return data.message;
    }

    // Generic messages based on HTTP status code
    switch (status) {
      case 400: return 'Invalid data submitted. Please check your inputs.';
      case 404: return 'The requested resource was not found.';
      case 409: return 'A duplicate record already exists.';
      case 500: return 'Server error. Please try again later.';
      default:  return `Request failed with status ${status}`;
    }
  }

  // Network error (server not reachable)
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

// Extract field-level validation errors from the API response
export const getFieldErrors = (error) => {
  if (error.response && error.response.data && error.response.data.errors) {
    return error.response.data.errors;
  }
  return {};
};

// =============================================================================
// DEBOUNCE - Delay function execution until user stops typing
// =============================================================================
// Used for search: don't call the API on every keystroke, wait until typing stops.
// PHP doesn't have this concept because PHP is server-side.
// This is a client-side (browser) optimization technique.
//
// Usage: const debouncedSearch = debounce(handleSearch, 500);
// =============================================================================
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// =============================================================================
// DEPARTMENTS list for the dropdown in the form
// =============================================================================
export const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Design',
  'Legal',
  'Customer Support',
  'Product',
];

// Status options
export const STATUS_OPTIONS = ['Active', 'Inactive'];
