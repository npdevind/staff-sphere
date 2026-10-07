// =============================================================================
// hooks/useEmployees.js - Custom React Hook for Employee Data
// =============================================================================
//
// WHAT IS A CUSTOM HOOK?
//   A custom hook is a JavaScript function that starts with "use" and uses
//   React's built-in hooks (useState, useEffect, etc.) to encapsulate
//   reusable stateful logic.
//
// WHY USE CUSTOM HOOKS?
//   Without hooks, every component that needs employee data would have to
//   duplicate all the useState, useEffect, loading state, and error handling code.
//   By extracting this into a custom hook, we write it once and reuse everywhere.
//
// PHP EQUIVALENT:
//   There's no direct PHP equivalent. The closest would be a PHP class
//   that your multiple controllers inherit from, or a utility function
//   that encapsulates database fetching and error handling.
//   But since PHP is stateless per request, state management doesn't apply.
//
// HOW HOOKS WORK:
//   - useState: Like a PHP variable, but React re-renders the component when it changes
//   - useEffect: Runs side effects (like API calls) after the component renders
//   - useCallback: Memoizes functions so they don't get recreated on every render
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { getEmployees, getEmployeeStats } from '../services/employeeService';
import { getErrorMessage } from '../utils/helpers';

// =============================================================================
// useEmployees Hook
// =============================================================================
// Returns: { employees, stats, loading, error, refetch }
// Usage: const { employees, loading, error } = useEmployees({ search: 'rahul' });
// =============================================================================
const useEmployees = (filters = {}) => {
  // STATE: These variables hold data and trigger re-renders when changed
  // PHP equivalent: $employees = []; $loading = false; $error = null;
  const [employees, setEmployees] = useState([]); // Array of employee objects
  const [stats, setStats]         = useState(null); // Dashboard statistics
  const [loading, setLoading]     = useState(true);  // Is data being fetched?
  const [error, setError]         = useState(null);   // Error message if fetch fails

  // =============================================================================
  // fetchData Function
  // =============================================================================
  // useCallback memoizes this function - it only gets recreated if `filters` change.
  // Without useCallback, the function would be recreated on every render,
  // causing useEffect to run in an infinite loop!
  // =============================================================================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      // Fetch employees and stats simultaneously for better performance
      // Promise.all runs both API calls in parallel (not one after the other)
      // PHP equivalent: making two separate DB queries, but Node.js can parallelize them
      const [employeesResponse, statsResponse] = await Promise.all([
        getEmployees(filters),
        getEmployeeStats(),
      ]);

      // Update state with the fetched data
      // This triggers a re-render of any component using this hook
      setEmployees(employeesResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (err) {
      // Set the error message so the component can display it
      setError(getErrorMessage(err));
      console.error('Error fetching employee data:', err);
    } finally {
      // finally runs whether the try block succeeded or failed
      // Always set loading to false when done
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // Re-run when filters change

  // =============================================================================
  // useEffect - Run fetchData when the component mounts or filters change
  // =============================================================================
  // useEffect with a dependency array runs:
  //   - Once when the component first mounts ([]  = run once)
  //   - Every time the dependencies change ([fetchData] = run when fetchData changes)
  //
  // PHP equivalent: This code runs on every page load (PHP doesn't have "mount"
  // because it recreates the page on every request)
  // =============================================================================
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return an object with data and functions the component can use
  // refetch allows components to manually trigger a data refresh (e.g., after delete)
  return { employees, stats, loading, error, refetch: fetchData };
};

export default useEmployees;
