// =============================================================================
// components/Spinner.jsx - Loading Spinner Component
// =============================================================================
//
// WHAT IS A REACT COMPONENT?
//   A React component is a function that returns JSX (looks like HTML).
//   It's a reusable UI building block.
//
// PHP EQUIVALENT:
//   In PHP, you'd include a partial HTML file: <?php include 'partials/spinner.php'; ?>
//   In React, you import and use the component: <Spinner />
//   The key difference: React components can have STATE (dynamic data),
//   while PHP partials are usually just static HTML.
//
// PROPS:
//   Props are arguments passed to a component (like HTML attributes).
//   <Spinner size="large" text="Loading employees..." />
//   PHP equivalent: a function call with parameters: spinner('large', 'Loading...')
// =============================================================================

// React is imported automatically in Vite projects (React 17+ auto-import)
// but it's good practice to be explicit for learning purposes

const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  // Map size prop to Tailwind CSS classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    // Centered flex container
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {/*
        The spinning circle: border-2 creates a thin border,
        border-t-primary-600 colors only the top border (creates the spinning effect),
        animate-spin is a Tailwind utility that applies a CSS rotation animation
      */}
      <div
        className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-4 border-gray-200 border-t-primary-600`}
        role="status"             // Accessibility: tells screen readers this is loading
        aria-label="Loading"      // Accessibility: text description for screen readers
      />
      {/* Show loading text if provided */}
      {text && (
        <p className="text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
};

export default Spinner;
