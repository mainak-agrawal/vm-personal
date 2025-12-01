#!/bin/bash
# Setup script for R2 Manager MCP Server on Linux/Mac

echo "===================================="
echo "R2 Manager MCP Server Setup"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.10 or higher"
    exit 1
fi

echo "[1/4] Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create virtual environment"
    exit 1
fi

echo "[2/4] Activating virtual environment..."
source venv/bin/activate

echo "[3/4] Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo "[4/4] Setting up environment file..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Created .env file from .env.example"
        echo ""
        echo "IMPORTANT: Please edit .env and add your R2 credentials!"
        echo "You can copy them from ../.env.local"
    else
        echo "Warning: .env.example not found"
    fi
else
    echo ".env file already exists, skipping..."
fi

echo ""
echo "===================================="
echo "Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your R2 credentials"
echo "2. Run: source venv/bin/activate"
echo "3. Run: python server.py"
echo ""
echo "To configure with GitHub Copilot, see README.md"
echo ""
