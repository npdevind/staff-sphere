// =============================================================================
// layouts/Sidebar.jsx - Navigation Sidebar Component
// =============================================================================
//
// This is the left navigation panel shown on desktop layouts.
// On mobile, it's hidden (use the hamburger menu in the header instead).
//
// REACT ROUTER NAVIGATION:
//   Instead of <a href="..."> which causes a full page reload (like PHP links),
//   React Router provides <Link> and <NavLink> components:
//   - <Link to="/employees"> → navigates without page reload (SPA behavior)
//   - <NavLink to="/employees"> → same as Link, but adds "active" class when the
//     current URL matches the `to` prop (useful for highlighting active nav items)
// =============================================================================

import { NavLink } from 'react-router-dom';

// Navigation items configuration
// Centralizing nav items here makes it easy to add/remove menu items
const navItems = [
  {
    to:    '/',
    label: 'Dashboard',
    exact: true, // Only match exactly '/', not '/employees'
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to:    '/employees',
    label: 'Employees',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay - dark background behind sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          {/* Logo icon */}
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">StaffSphere</h1>
            <p className="text-xs text-gray-500">Employee Management</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4 space-y-1">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact} // "end" prop makes it match exactly (like `exact` in React Router v5)
              onClick={onClose} // Close mobile sidebar when a link is clicked
              className={({ isActive }) =>
                // NavLink's className prop can be a function that receives { isActive }
                // This lets us apply different styles based on whether this link is active
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold' // Active: highlighted
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Inactive: normal
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Version info */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">StaffSphere v1.0.0</p>
          <p className="text-xs text-gray-400">Built with React + Node.js</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
