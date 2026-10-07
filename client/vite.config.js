import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Vite is the build tool for our React app (similar to webpack, but much faster)
// 
// PHP equivalent concept:
//   Vite compiles our React JSX/ES modules into browser-compatible JS,
//   just like a PHP framework's asset pipeline (like Laravel Mix/Vite).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend dev server port
    // Proxy API requests to the backend during development
    // This avoids CORS issues in development:
    //   Instead of: axios.get('http://localhost:5000/api/employees')
    //   You can write: axios.get('/api/employees') and Vite forwards it
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
