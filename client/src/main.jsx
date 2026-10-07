// =============================================================================
// main.jsx - React Application Entry Point
// =============================================================================
//
// PHP EQUIVALENT:
//   This is similar to index.php - it's the first file that runs.
//   But instead of outputting HTML, it mounts the React app into the DOM.
//
// WHAT HAPPENS HERE:
//   1. Import React and ReactDOM
//   2. Import the root App component
//   3. Import global CSS styles
//   4. Tell React to render the App into the #root div in index.html
//   5. Wrap everything in BrowserRouter for client-side routing
//
// JSX:
//   The <App /> syntax is JSX (JavaScript XML).
//   It's NOT HTML - it's special JavaScript syntax that gets compiled
//   by Vite/Babel into: React.createElement(App, null)
//   PHP doesn't have anything directly equivalent, but think of it as
//   a template syntax that compiles to function calls.
// =============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';

// React Router for client-side navigation (like PHP URL routing but in the browser)
import { BrowserRouter } from 'react-router-dom';

// React Toastify for beautiful notifications (success/error messages)
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Our root App component (contains routing setup)
import App from './App';

// Global CSS styles (Tailwind directives + custom styles)
import './index.css';

// =============================================================================
// Mount the React App
// =============================================================================
// document.getElementById('root') finds the <div id="root"> in index.html
// createRoot creates a React root and renders our app inside it
// StrictMode enables extra warnings and checks during development
// =============================================================================
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      BrowserRouter enables client-side routing using the HTML5 History API.
      Without this, React Router would not be able to handle navigation.
      
      PHP equivalent: .htaccess URL rewriting rules + your router class
      React Router handles everything in the browser without server requests.
    */}
    <BrowserRouter>
      <App />
      {/*
        ToastContainer renders notification toasts at the top-right of the screen.
        It listens for toast() calls from anywhere in the app.
        Place it outside of routes so it's always available.
      */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  </React.StrictMode>
);
