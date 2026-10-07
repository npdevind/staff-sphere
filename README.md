# StaffSphere — Employee Management System

> A full-stack **Employee Management System** built with **React.js**, **Node.js/Express**, and **PostgreSQL**. Designed as a hands-on learning project for PHP backend developers transitioning into modern JavaScript full-stack development.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Prerequisites](#4-prerequisites)
5. [Database Setup](#5-database-setup)
6. [Backend Setup](#6-backend-setup)
7. [Frontend Setup](#7-frontend-setup)
8. [Running the Application](#8-running-the-application)
9. [API Reference](#9-api-reference)
10. [Testing with Postman](#10-testing-with-postman)
11. [Troubleshooting](#11-troubleshooting)
12. [PHP to Node.js Learning Guide](#12-php-to-nodejs-learning-guide)
13. [Suggested Exercises](#13-suggested-exercises)

---

## 1. Project Overview

StaffSphere is a complete CRUD (Create, Read, Update, Delete) application for managing employees. It demonstrates:

- **React.js** functional components, Hooks, and React Router for the frontend
- **Express.js** REST API for the backend
- **PostgreSQL** database with parameterized queries
- **Tailwind CSS** for responsive UI styling
- **Axios** for HTTP communication between frontend and backend
- **Layered architecture**: routes → controllers → services → database

### Features

| Feature | Description |
|---------|-------------|
| Employee List | Table with search, filter by status/department, pagination-ready |
| Add Employee | Form with frontend + backend validation |
| View Employee | Full detail view |
| Edit Employee | Pre-populated form with update capability |
| Delete Employee | Confirmation dialog before deletion |
| Dashboard | Summary cards with total/active/inactive counts |
| Toast Notifications | Success and error feedback |
| Responsive Design | Works on desktop, tablet, and mobile |

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.x | UI framework |
| Vite | 5.x | Development build tool |
| Tailwind CSS | 3.x | Utility-first CSS styling |
| React Router DOM | 6.x | Client-side routing |
| Axios | 1.x | HTTP requests to the API |
| React Toastify | 10.x | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.x | Web framework / HTTP server |
| pg (node-postgres) | 8.x | PostgreSQL client |
| dotenv | 16.x | Environment variable loading |
| cors | 2.x | Cross-origin request handling |
| nodemon | 3.x | Auto-restart during development |

### Database
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Relational database for storing employee data |

---

## 3. Project Structure

```
StaffSphere/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ConfirmDialog.jsx    # Delete confirmation modal
│   │   │   ├── EmptyState.jsx       # Empty list state
│   │   │   ├── ErrorAlert.jsx       # Error display
│   │   │   ├── Spinner.jsx          # Loading indicator
│   │   │   └── StatusBadge.jsx      # Active/Inactive badge
│   │   ├── hooks/
│   │   │   └── useEmployees.js      # Custom hook for fetching data
│   │   ├── layouts/
│   │   │   ├── Header.jsx           # Top navigation bar
│   │   │   ├── MainLayout.jsx       # App shell (sidebar + header)
│   │   │   └── Sidebar.jsx          # Left sidebar navigation
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Home / stats page
│   │   │   ├── EmployeeDetail.jsx   # View one employee
│   │   │   ├── EmployeeForm.jsx     # Add / Edit employee form
│   │   │   ├── EmployeeList.jsx     # Employee table with search
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance configuration
│   │   │   └── employeeService.js   # API call functions
│   │   ├── utils/
│   │   │   └── helpers.js           # Utility functions + constants
│   │   ├── App.jsx                  # Root component with routes
│   │   ├── index.css                # Global styles + Tailwind
│   │   └── main.jsx                 # App entry point
│   ├── .env.example                 # Environment variable template
│   ├── index.html                   # HTML entry point
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express.js backend
│   ├── config/
│   │   └── db.js                    # PostgreSQL connection pool
│   ├── controllers/
│   │   └── employeeController.js    # Request/response handlers
│   ├── middleware/
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validateEmployee.js      # Input validation middleware
│   ├── routes/
│   │   └── employeeRoutes.js        # URL → controller mapping
│   ├── services/
│   │   └── employeeService.js       # Database query functions
│   ├── app.js                       # Express app configuration
│   ├── server.js                    # HTTP server entry point
│   ├── .env.example                 # Environment variable template
│   └── package.json
│
├── database/
│   └── schema.sql                   # PostgreSQL schema + sample data
│
├── .gitignore
└── README.md
```

---

## 4. Prerequisites

Before starting, make sure you have the following installed:

### Required
- **Node.js** (v18 or later) — [Download](https://nodejs.org)
  ```
  # Verify: open terminal and run:
  node --version    # Should show v18.x.x or higher
  npm --version     # Should show 9.x.x or higher
  ```

- **PostgreSQL** (v14 or later) — [Download](https://www.postgresql.org/download/)
  ```
  # Verify:
  psql --version    # Should show psql (PostgreSQL) 14.x or higher
  ```

### Optional (Recommended)
- **Postman** — for testing the API ([Download](https://www.postman.com))
- **pgAdmin** — GUI for PostgreSQL ([Download](https://www.pgadmin.org))
- **VS Code** — code editor ([Download](https://code.visualstudio.com))

---

## 5. Database Setup

### Step 1: Create the Database

Open a terminal and connect to PostgreSQL:
```bash
psql -U postgres
```

> **Windows users**: If `psql` is not recognized, add PostgreSQL to your PATH or use the full path:
> `"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres`

Create the database:
```sql
CREATE DATABASE employee_management;
```

Exit psql:
```sql
\q
```

### Step 2: Run the Schema

**Method A — Using psql (recommended):**
```bash
psql -U postgres -d employee_management -f database/schema.sql
```

**Method B — Inside psql:**
```bash
psql -U postgres
\c employee_management
\i C:/path/to/StaffSphere/database/schema.sql
```

> **Note**: Use forward slashes in psql on Windows (e.g., `C:/projects/StaffSphere/database/schema.sql`)

### Step 3: Verify the Setup

```bash
psql -U postgres -d employee_management
```
```sql
-- Check that the table was created:
\dt

-- Check the sample data was inserted:
SELECT COUNT(*) FROM employees;

-- See all employees:
SELECT id, full_name, department, status FROM employees;

-- Exit:
\q
```

Expected output: **8 employees** in the `employees` table.

---

## 6. Backend Setup

### Step 1: Navigate to the server directory
```bash
cd StaffSphere/server
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create your .env file
```bash
# Windows (Command Prompt):
copy .env.example .env

# Windows (PowerShell):
Copy-Item .env.example .env

# Mac/Linux:
cp .env.example .env
```

### Step 4: Edit the .env file

Open `server/.env` in a text editor and fill in your PostgreSQL credentials:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management
DB_USER=postgres
DB_PASSWORD=your_actual_password_here

CLIENT_URL=http://localhost:5173
```

> ⚠️ **Replace `your_actual_password_here`** with your actual PostgreSQL password.

---

## 7. Frontend Setup

### Step 1: Navigate to the client directory
```bash
cd StaffSphere/client
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create your .env file
```bash
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env
```

The default `.env` file works without changes in development because Vite proxies `/api` to `http://localhost:5000`.

---

## 8. Running the Application

### Start the Backend

Open **Terminal 1**:
```bash
cd StaffSphere/server
npm run dev
```

Expected output:
```
╔════════════════════════════════════════════╗
║        StaffSphere API Server              ║
╠════════════════════════════════════════════╣
║  Server:  http://localhost:5000            ║
║  Health:  http://localhost:5000/api/health ║
║  Mode:    development                      ║
╚════════════════════════════════════════════╝

✅ PostgreSQL database connected successfully!
```

### Start the Frontend

Open **Terminal 2**:
```bash
cd StaffSphere/client
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Access the Application

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | React frontend (main app) |
| `http://localhost:5000/api/health` | Backend health check |
| `http://localhost:5000/api/employees` | API endpoint |

---

## 9. API Reference

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/health` | Server health check | 200 |
| `GET` | `/employees` | List all employees | 200 |
| `GET` | `/employees/stats` | Dashboard statistics | 200 |
| `GET` | `/employees/:id` | Get one employee | 200, 404 |
| `POST` | `/employees` | Create employee | 201, 400, 409 |
| `PUT` | `/employees/:id` | Update employee | 200, 400, 404, 409 |
| `DELETE` | `/employees/:id` | Delete employee | 200, 404 |

### Query Parameters (GET /employees)

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `search` | string | `?search=rahul` | Search name, email, department |
| `status` | string | `?status=Active` | Filter by Active or Inactive |
| `department` | string | `?department=Engineering` | Filter by department |

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "full_name": "Rahul Sharma",
    "email": "rahul@company.com"
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed. Please correct the errors below.",
  "errors": {
    "email": "Please enter a valid email address",
    "full_name": "Full name is required"
  }
}
```

---

## 10. Testing with Postman

### Import this Collection

Create a new Postman collection called "StaffSphere API" and add these requests:

#### 1. Health Check
- Method: `GET`
- URL: `http://localhost:5000/api/health`
- Expected: `{ "success": true, "data": { "status": "healthy", "database": "connected" } }`

#### 2. Get All Employees
- Method: `GET`
- URL: `http://localhost:5000/api/employees`

#### 3. Search Employees
- Method: `GET`
- URL: `http://localhost:5000/api/employees?search=rahul&status=Active`

#### 4. Get One Employee
- Method: `GET`
- URL: `http://localhost:5000/api/employees/1`

#### 5. Create Employee
- Method: `POST`
- URL: `http://localhost:5000/api/employees`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "full_name": "Test Employee",
  "email": "test.employee@company.com",
  "phone": "+91-9999999999",
  "department": "Engineering",
  "designation": "Software Engineer",
  "joining_date": "2024-01-15",
  "status": "Active"
}
```

#### 6. Update Employee
- Method: `PUT`
- URL: `http://localhost:5000/api/employees/1`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "full_name": "Rahul Sharma Updated",
  "email": "rahul.sharma@staffsphere.com",
  "phone": "+91-9876543210",
  "department": "Engineering",
  "designation": "Lead Software Engineer",
  "joining_date": "2022-03-15",
  "status": "Active"
}
```

#### 7. Delete Employee
- Method: `DELETE`
- URL: `http://localhost:5000/api/employees/1`

#### 8. Test Duplicate Email (should return 409)
- Method: `POST`
- URL: `http://localhost:5000/api/employees`
- Body:
```json
{
  "full_name": "Duplicate Test",
  "email": "rahul.sharma@staffsphere.com",
  "phone": "+91-1111111111",
  "department": "HR",
  "designation": "Manager",
  "joining_date": "2024-01-01",
  "status": "Active"
}
```

#### 9. Test Non-existent Employee (should return 404)
- Method: `GET`
- URL: `http://localhost:5000/api/employees/99999`

#### 10. Test Validation Error (should return 400)
- Method: `POST`
- URL: `http://localhost:5000/api/employees`
- Body:
```json
{
  "full_name": "",
  "email": "not-an-email",
  "phone": "",
  "department": "",
  "designation": "",
  "joining_date": ""
}
```

---

## 11. Troubleshooting

### ❌ "Cannot connect to the server. Is the backend running on port 5000?"
- Make sure the backend server is running: `cd server && npm run dev`
- Check that port 5000 is not being used by another application
- Verify `.env` file exists in the `server/` directory

### ❌ "Database connection failed! Error: password authentication failed"
- Open `server/.env` and verify `DB_PASSWORD` is correct
- Try connecting manually: `psql -U postgres -W` (will prompt for password)
- On Windows, the default postgres password is set during installation

### ❌ "Error: relation 'employees' does not exist"
- The schema wasn't applied yet. Run:
  ```bash
  psql -U postgres -d employee_management -f database/schema.sql
  ```

### ❌ "ECONNREFUSED" or database not connecting
- Make sure PostgreSQL is running:
  - **Windows**: Check Services → PostgreSQL service should be "Running"
  - **Mac**: `brew services start postgresql`
  - **Linux**: `sudo systemctl start postgresql`
- Verify `DB_HOST=localhost` and `DB_PORT=5432` in `.env`

### ❌ Frontend shows "network error" but backend is running
- Verify the Vite proxy in `client/vite.config.js` points to `http://localhost:5000`
- Check CORS: `CLIENT_URL=http://localhost:5173` in `server/.env`
- Make sure frontend runs on port 5173 and backend on port 5000

### ❌ Tailwind CSS classes not applying
- Make sure `tailwind.config.js` content array includes `./src/**/*.{js,ts,jsx,tsx}`
- Verify `index.css` has the three `@tailwind` directives at the top
- Restart the Vite dev server: `Ctrl+C` then `npm run dev`

### ❌ "Module not found" errors
- Run `npm install` in both `client/` and `server/` directories
- Make sure you're in the correct directory before running `npm install`

---

## 12. PHP to Node.js Learning Guide

This section explains how PHP concepts map to Node.js and React.

### Runtime Model

| Concept | PHP | Node.js |
|---------|-----|---------|
| **How code runs** | Fresh process per request | Long-running process |
| **Concurrency** | Multiple Apache workers | Single thread + event loop |
| **I/O handling** | Synchronous (blocking) | Asynchronous (non-blocking) |
| **Memory** | Cleared after each request | Persists between requests |

### Server / Framework

| PHP | Node.js Equivalent |
|-----|--------------------|
| Apache / Nginx serves PHP | `app.listen(5000)` in Node.js starts the server |
| `index.php` as entry point | `server.js` as entry point |
| Laravel / CodeIgniter | Express.js |
| Laravel routes/api.php | `routes/employeeRoutes.js` |
| Laravel Controller | `controllers/employeeController.js` |
| Laravel Model | `services/employeeService.js` |
| Laravel Middleware | Express `middleware/*.js` files |
| `header('Location: /page')` | `navigate('/page')` or `res.redirect()` |

### Request Handling

| PHP | Node.js (Express) |
|-----|--------------------|
| `$_POST['name']` | `req.body.name` |
| `$_GET['search']` | `req.query.search` |
| `$_SERVER['REQUEST_METHOD']` | `req.method` |
| Route param `?id=5` | Route param `:id` → `req.params.id` |
| `json_decode(php://input)` | `express.json()` middleware → `req.body` |
| `echo json_encode($data)` | `res.json({ data })` |
| `http_response_code(201)` | `res.status(201).json(...)` |

### Database

| PHP (PDO) | Node.js (pg) |
|-----------|-------------|
| `new PDO("pgsql:host=...")` | `new Pool({ host: ... })` |
| `$stmt = $pdo->prepare($sql)` | `pool.query(sql, params)` |
| `$stmt->execute([$id])` | Second argument to `pool.query()` |
| `:param` placeholders | `$1, $2, $3...` placeholders |
| `$stmt->fetchAll()` | `result.rows` |
| `$stmt->fetch()` | `result.rows[0]` |
| `$pdo->lastInsertId()` | Use `RETURNING *` in SQL |
| Synchronous by default | Use `await pool.query()` |

### Async / Await vs PHP

```php
// PHP (synchronous - blocks until query completes)
$stmt = $pdo->prepare("SELECT * FROM employees");
$stmt->execute();
$employees = $stmt->fetchAll();
```

```javascript
// Node.js (asynchronous - uses async/await)
// 'await' pauses THIS function, not the whole server
const result = await pool.query("SELECT * FROM employees");
const employees = result.rows;
```

### Frontend Concepts

| PHP | React |
|-----|-------|
| PHP files generate HTML on server | React generates HTML in browser |
| Page reload on form submit | No reload with `e.preventDefault()` |
| `$_POST` via form submit | Axios `POST` request with JSON body |
| PHP template variables | React `state` and `props` |
| PHP `include 'partial.php'` | React `<ComponentName />` |
| PHP `foreach ($items as $item)` | JavaScript `items.map(item => ...)` |
| Form `action="/employees/store"` | `axios.post('/api/employees', data)` |

---

## 13. Suggested Exercises

Work through these exercises progressively to deepen your understanding.

### 🟢 Beginner (Week 1–2)
1. **Add a phone field to the list table** — Show the phone number in the employee list table
2. **Add a "Copy Email" button** — On the detail page, add a button that copies the email to clipboard
3. **Sort the table** — Add clickable column headers to sort employees by name, department, or date
4. **Improve the empty state** — Add a different illustration/message when no search results are found
5. **Add character count** — Show remaining character count next to the Full Name and Designation fields

### 🟡 Intermediate (Week 3–4)
6. **Add pagination** — Limit the API to return 10 employees per page, add Previous/Next buttons
7. **Export to CSV** — Add a button that downloads all employees as a CSV file
8. **Bulk status update** — Add checkboxes to select multiple employees and update their status
9. **Add a Departments page** — Show all unique departments with employee counts
10. **Input autosave** — Save form data to `localStorage` so it's not lost on accidental page reload

### 🔴 Advanced (Week 5+)
11. **Add authentication** — Implement JWT login so only logged-in users can access the app
12. **Soft delete** — Instead of permanently deleting, add a `deleted_at` column and filter deleted records
13. **Audit log** — Create an `audit_logs` table to track who created/updated/deleted employees
14. **Image upload** — Allow uploading a profile photo for each employee
15. **API rate limiting** — Add the `express-rate-limit` package to prevent API abuse

---

## 📚 Additional Resources

- [React Official Docs](https://react.dev)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [node-postgres (pg) Docs](https://node-postgres.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/en/main)
- [Axios Docs](https://axios-http.com/docs/intro)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)

---

*Built with ❤️ using React, Node.js, Express, PostgreSQL, and Tailwind CSS*
