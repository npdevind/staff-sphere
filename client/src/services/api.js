// =============================================================================
// services/api.js - Axios HTTP Client Configuration
// =============================================================================
//
// WHAT IS AXIOS?
//   Axios is a JavaScript library for making HTTP requests (like cURL in PHP).
//   It replaces the browser's built-in fetch() API with a cleaner interface.
//
// PHP EQUIVALENT:
//   In PHP, you'd use cURL to call external APIs:
//     $ch = curl_init('http://localhost:5000/api/employees');
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//     $result = curl_exec($ch);
//     $data = json_decode($result, true);
//
//   Axios simplifies this to:
//     const response = await axios.get('/api/employees');
//     const data = response.data;
//
// WHY A SEPARATE API FILE?
//   Instead of writing axios.get('http://localhost:5000/api/employees') everywhere,
//   we create one configured instance here.
//   If the base URL changes (e.g., in production), we only change it here.
//   This is the DRY principle (Don't Repeat Yourself).
// =============================================================================

import axios from 'axios';

// =============================================================================
// Create a configured Axios instance
// =============================================================================
// baseURL is prepended to all requests made with this instance
// So api.get('/employees') becomes GET http://localhost:5000/api/employees
//
// We read the base URL from environment variables (.env file in client/)
// process.env is replaced by Vite with actual values during build
// VITE_ prefix is required for Vite to expose env variables to the browser
// =============================================================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000, // 10 second timeout (if server doesn't respond, show error)
  headers: {
    'Content-Type': 'application/json', // Tell the server we're sending JSON
  },
});

// =============================================================================
// Request Interceptor
// =============================================================================
// This runs BEFORE every request is sent.
// You can use this to add auth tokens, log requests, etc.
//
// PHP equivalent: A "before filter" or middleware that runs before each request
// =============================================================================
api.interceptors.request.use(
  (config) => {
    // In development, log what requests are being made (helpful for learning!)
    if (import.meta.env.DEV) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config; // Must return config to proceed with the request
  },
  (error) => {
    return Promise.reject(error); // If there's a request setup error, reject it
  }
);

// =============================================================================
// Response Interceptor
// =============================================================================
// This runs AFTER every response is received.
// We use it to centrally handle common errors (like network failures).
//
// PHP equivalent: A "after filter" that processes all responses
// =============================================================================
api.interceptors.response.use(
  (response) => {
    // 2xx responses come here - just return them as-is
    return response;
  },
  (error) => {
    // Any non-2xx response or network error comes here

    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      // Server is down or unreachable
      error.message = 'Cannot connect to the server. Is the backend running on port 5000?';
    } else if (error.code === 'ECONNABORTED') {
      // Request took too long
      error.message = 'The request timed out. Please try again.';
    }

    return Promise.reject(error); // Re-throw so component-level catch blocks can handle it
  }
);

export default api;
