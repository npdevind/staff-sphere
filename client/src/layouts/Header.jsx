// =============================================================================
// layouts/Header.jsx - Top Navigation Bar Component
// =============================================================================

const Header = ({ onMenuToggle, pageTitle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side: Mobile menu toggle + page title */}
        <div className="flex items-center gap-4">
          {/* Hamburger menu button - only visible on mobile (lg:hidden) */}
          <button
            id="header-menu-toggle-btn"
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title - changes based on current page */}
          <h2 className="text-lg font-semibold text-gray-800">{pageTitle || 'Dashboard'}</h2>
        </div>

        {/* Right side: Status indicator */}
        <div className="flex items-center gap-3">
          {/* API status indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            API Connected
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
