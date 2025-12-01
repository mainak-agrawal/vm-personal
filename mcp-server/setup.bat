@echo off
REM Setup script for R2 Manager MCP Server on Windows

echo ====================================
echo R2 Manager MCP Server Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10 or higher
    exit /b 1
)

echo [1/4] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    exit /b 1
)

echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)

echo [4/4] Setting up environment file...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo Created .env file from .env.example
        echo.
        echo IMPORTANT: Please edit .env and add your R2 credentials!
        echo You can copy them from ../.env.local
    ) else (
        echo Warning: .env.example not found
    )
) else (
    echo .env file already exists, skipping...
)

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Edit .env file and add your R2 credentials
echo 2. Run: venv\Scripts\activate.bat
echo 3. Run: python server.py
echo.
echo To configure with GitHub Copilot, see README.md
echo.

pause
