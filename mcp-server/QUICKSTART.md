# Quick Start Guide - R2 Manager MCP Server

## Installation (5 minutes)

### Windows:
```powershell
cd mcp-server
.\setup.bat
```

### Linux/Mac:
```bash
cd mcp-server
chmod +x setup.sh
./setup.sh
```

### Manual Installation:
```bash
cd mcp-server
python -m venv venv

# Windows:
.\venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your R2 credentials
```

## Configuration

1. **Copy R2 credentials** from parent `.env.local`:
   ```bash
   # The setup script creates .env, just edit it with your credentials
   R2_ACCESS_KEY=<access-key>
   R2_SECRET_KEY=<Secret-key>
   ```

2. **Configure GitHub Copilot** in VS Code settings (JSON):
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - Type "Preferences: Open User Settings (JSON)"
   - Add this configuration:

   ```json
   {
     "github.copilot.chat.codeGeneration.useInstructionFiles": true,
     "github.copilot.advanced": {
       "mcp": {
         "enabled": true
       }
     }
   }
   ```

3. **Create MCP configuration file** at `~/.config/github-copilot/mcp.json` (Linux/Mac) or `%APPDATA%\github-copilot\mcp.json` (Windows):

   ```json
   {
     "mcpServers": {
       "r2-manager": {
         "command": "python",
         "args": [
           "C:/Users/maiagrawal/personal-projects/vm-personal/mcp-server/server.py"
         ],
         "env": {
           "PYTHONPATH": "C:/Users/maiagrawal/personal-projects/vm-personal/mcp-server"
         }
       }
     }
   }
   ```

   **Important**: Update the paths to match your actual project location!

## Running the Server

1. **Activate virtual environment**:
   ```bash
   # Windows:
   cd mcp-server
   .\venv\Scripts\activate
   
   # Linux/Mac:
   cd mcp-server
   source venv/bin/activate
   ```

2. **Start the server**:
   ```bash
   python server.py
   ```

   You should see:
   ```
   🚀 Starting R2 Manager MCP Server...
   📦 Bucket: vm-personal-website
   🔗 Endpoint: https://...
   ✅ Server ready for connections
   ```

3. **Keep the server running** while using GitHub Copilot

## Using with GitHub Copilot

Once the server is running and configured, you can use natural language commands:

### Example Commands:

**List files:**
- "Show me all files in the R2 bucket"
- "List files in class-X-physics"
- "What files are in the Laws of Motion topic?"

**Upload files:**
- "Upload C:/Documents/chapter1.pdf to class-X-physics/Laws_Of_Motion/"
- "Add this file to class XI gravitation topic"

**Read content:**
- "Show me the videos.txt file for class X physics Laws of Motion"
- "What YouTube videos are in class XII Wave Optics?"

**Write content:**
- "Add https://www.youtube.com/watch?v=abc123 to class-X-physics/Laws_Of_Motion/videos.txt"
- "Create a videos.txt file for class XI Gravitation with this URL: https://youtube.com/watch?v=xyz789"

**Delete files:**
- "Delete class-X-physics/Laws_Of_Motion/old-file.pdf"
- "Remove the test files from the bucket"

**Update files:**
- "Update class-X-physics/Laws_Of_Motion/chapter1.pdf with C:/Documents/new-chapter1.pdf"

**Get structure:**
- "Show me the structure of the R2 bucket"
- "What's the organization of files in R2?"

## After Making Changes

After uploading, updating, or deleting files, **rebuild your website** to see the changes:

```bash
cd ..  # Go back to project root
npm run build
```

## Troubleshooting

### Server won't start
- Check Python version: `python --version` (need 3.10+)
- Verify virtual environment is activated (you should see `(venv)` in your prompt)
- Check `.env` file has correct credentials

### GitHub Copilot doesn't see the server
- Verify the MCP configuration file path is correct
- Check that paths in `mcp.json` match your project location
- Restart VS Code after updating configuration
- Make sure the server is running (check terminal for startup messages)

### R2 operations fail
- Verify credentials in `.env` are correct
- Check bucket name: `vm-personal-website`
- Ensure your R2 API token has read/write permissions
- Test connection: Try "list all files in R2"

### "Module not found" errors
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again
- Check that you're in the `mcp-server` directory

## File Structure Expected in R2

```
vm-personal-website/
├── class-X-physics/
│   ├── Laws_Of_Motion/
│   │   ├── chapter1.pdf
│   │   ├── notes.docx
│   │   └── videos.txt
│   ├── Electricity/
│   │   └── ...
├── class-XI-Physics/
│   ├── Gravitation/
│   │   └── videos.txt
│   └── ...
└── class-XII-Physics/
    └── ...
```

**Key format**: `{grade-subject}/{topic}/{filename}`

## Tips

1. **Always keep the server running** while using GitHub Copilot for R2 operations
2. **Test with simple commands first** like "list all files"
3. **Use full paths** when uploading files (e.g., `C:/path/to/file.pdf`)
4. **Follow naming conventions** for topics (use underscores, not spaces)
5. **Remember to rebuild** the website after making changes

## Need Help?

Check the full README.md for detailed documentation and advanced usage.
