// =============================================================================
// layouts/MainLayout.jsx - Main Application Layout
// =============================================================================
//
// WHAT IS A LAYOUT COMPONENT?
//   A layout component wraps your pages and provides a consistent structure:
//   sidebar, header, and a main content area where pages render.
//
// PHP EQUIVALENT:
//   In PHP, you'd use a master template:
//     <?php include 'layouts/header.php'; ?>
//     <?php include 'layouts/sidebar.php'; ?>
//     <main><?php echo $pageContent; ?></main>
//     <?php include 'layouts/footer.php'; ?>
//
//   In React, we use the {children} prop instead of PHP includes.
//   <MainLayout> wraps around the page component, which gets rendered as {children}.
//
// USING useLocation:
//   useLocation() from React Router gives us the current URL pathname.
//   We use this to determine which page is active and set the header title.
// =============================================================================

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

// Map URL paths to readable page titles for the header
const PAGE_TITLES = {
  '/':                   'Dashboard',
  '/employees':          'Employees',
  '/employees/new':      'Add Employee',
  '/employees/edit':     'Edit Employee',
};

// Get a page title based on the current pathname
const getPageTitle = (pathname) => {
  if (pathname === '/') return PAGE_TITLES['/'];
  if (pathname.endsWith('/new')) return 'Add Employee';
  if (pathname.includes('/edit')) return 'Edit Employee';
  if (pathname.includes('/employees/') && !pathname.endsWith('/new')) return 'Employee Details';
  if (pathname.startsWith('/employees')) return PAGE_TITLES['/employees'];
  return 'StaffSphere';
};

const MainLayout = ({ children }) => {
  // State to track whether the mobile sidebar is open
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get current URL path from React Router
  // PHP equivalent: $_SERVER['REQUEST_URI']
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    // Full-height flex container: sidebar on the left, content on the right
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar: fixed width, full height */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content area: takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header: stays at the top */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          pageTitle={pageTitle}
        />

        {/* Page content: scrollable area */}
        {/*
          {children} is where the current page's content appears.
          When you navigate to /employees, <EmployeeList /> is rendered here.
          When you navigate to /employees/new, <EmployeeForm /> is rendered here.
          
          This is like PHP's content slot in a template engine (Blade, Twig, etc.)
        */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
