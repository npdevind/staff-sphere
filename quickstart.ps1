# StaffSphere Quick Start Script for Windows PowerShell
# Run this from the StaffSphere root directory: .\quickstart.ps1
#
# PREREQUISITES:
#   - Node.js installed (node --version should work)
#   - PostgreSQL installed and running
#   - You have already set your DB_PASSWORD in server/.env

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  StaffSphere Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create .env files if they don't exist
Write-Host "Step 1: Setting up environment files..." -ForegroundColor Yellow

if (-Not (Test-Path "server\.env")) {
    Copy-Item "server\.env.example" "server\.env"
    Write-Host "  Created server/.env from .env.example" -ForegroundColor Green
    Write-Host "  !! IMPORTANT: Open server/.env and set your DB_PASSWORD !!" -ForegroundColor Red
} else {
    Write-Host "  server/.env already exists - skipping" -ForegroundColor Gray
}

if (-Not (Test-Path "client\.env")) {
    Copy-Item "client\.env.example" "client\.env"
    Write-Host "  Created client/.env from .env.example" -ForegroundColor Green
} else {
    Write-Host "  client/.env already exists - skipping" -ForegroundColor Gray
}

Write-Host ""

# Step 2: Install server dependencies
Write-Host "Step 2: Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
Set-Location ..
Write-Host "  Server dependencies installed!" -ForegroundColor Green
Write-Host ""

# Step 3: Install client dependencies
Write-Host "Step 3: Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..
Write-Host "  Client dependencies installed!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Set up PostgreSQL database:" -ForegroundColor White
Write-Host "     psql -U postgres -c 'CREATE DATABASE employee_management;'" -ForegroundColor Gray
Write-Host "     psql -U postgres -d employee_management -f database/schema.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Edit your server/.env file:" -ForegroundColor White
Write-Host "     Set DB_PASSWORD=your_actual_postgres_password" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Start the backend (in Terminal 1):" -ForegroundColor White
Write-Host "     cd server" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Start the frontend (in Terminal 2):" -ForegroundColor White
Write-Host "     cd client" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  5. Open your browser:" -ForegroundColor White
Write-Host "     http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
