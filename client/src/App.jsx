// =============================================================================
// App.jsx - Root Application Component with Routing
// =============================================================================
//
// WHAT IS CLIENT-SIDE ROUTING?
//   Traditional PHP routing:
//     - User visits /employees → Apache/Nginx finds employees/index.php → PHP runs → HTML returned
//     - Every navigation causes a full server round-trip and page reload
//     - The browser re-downloads HTML, CSS, JS on every page visit
//
//   React Router (client-side routing):
//     - User visits /employees → Browser loads index.html ONCE → React app starts
//     - React Router intercepts navigation → no server request, no page reload
//     - React swaps the component being rendered (like showing/hiding sections)
//     - The URL changes (looks like normal navigation) but the browser doesn't reload
//     - This is why React apps feel fast and app-like
//
// HOW ROUTES WORK HERE:
//   <Routes> contains all possible routes
//   <Route path="/" element={<Dashboard />} /> → render Dashboard for "/"
//   <Route path="/employees" element={<EmployeeList />} /> → render EmployeeList for "/employees"
//   When user navigates to /employees, React unmounts Dashboard and mounts EmployeeList
// =============================================================================

import { Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard      from './pages/Dashboard';
import EmployeeList   from './pages/EmployeeList';
import EmployeeForm   from './pages/EmployeeForm';
import EmployeeDetail from './pages/EmployeeDetail';
import NotFound       from './pages/NotFound';

// =============================================================================
// App Component
// =============================================================================
const App = () => {
  return (
    // MainLayout provides the sidebar + header wrapper around all pages
    <MainLayout>
      {/*
        Routes: Container for all route definitions
        Only ONE route will match and render at a time.
        
        PHP equivalent (Laravel):
          Route::get('/', [DashboardController::class, 'index']);
          Route::get('/employees', [EmployeeController::class, 'index']);
          Route::get('/employees/new', [EmployeeController::class, 'create']);
          Route::get('/employees/{id}', [EmployeeController::class, 'show']);
          Route::get('/employees/{id}/edit', [EmployeeController::class, 'edit']);
      */}
      <Routes>
        {/* Dashboard - Home page */}
        <Route path="/" element={<Dashboard />} />

        {/* Employee list */}
        <Route path="/employees" element={<EmployeeList />} />

        {/* Add new employee - IMPORTANT: must come before /:id routes */}
        <Route path="/employees/new" element={<EmployeeForm />} />

        {/* View single employee */}
        {/*
          :id is a dynamic segment - matches any value
          /employees/5 → id = "5"
          /employees/42 → id = "42"
        */}
        <Route path="/employees/:id" element={<EmployeeDetail />} />

        {/* Edit employee */}
        <Route path="/employees/:id/edit" element={<EmployeeForm />} />

        {/* 404 - Catch all unmatched routes */}
        {/* The * wildcard matches any path that didn't match above */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
