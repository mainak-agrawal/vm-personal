# Cloudflare R2 MCP Server

This is a Model Context Protocol (MCP) server that provides tools for managing your Cloudflare R2 storage bucket used by the vm-personal website. It allows you to interact with your R2 storage through GitHub Copilot or any MCP-compatible client.

## Features

- **List files**: Browse all files in your R2 bucket with filtering by grade/subject/topic
- **Upload files**: Add new study materials (PDFs, videos, documents) to specific topics
- **Delete files**: Remove outdated or incorrect files
- **Update files**: Replace existing files with new versions
- **Manage videos.txt**: Add/remove YouTube video URLs for topics

## Architecture

This MCP server is **completely separate** from the Next.js website build:
- Located in `mcp-server/` directory
- Uses Python for implementation
- Runs independently as a local service
- Does NOT get deployed with the website
- Communicates with Cloudflare R2 using boto3 (S3-compatible API)

## Prerequisites

- Python 3.10 or higher
- Access to Cloudflare R2 credentials (same as in `.env.local`)
- GitHub Copilot or another MCP-compatible client

## Installation

1. **Navigate to the MCP server directory**:
   ```bash
   cd mcp-server
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   
   # On Windows:
   .\venv\Scripts\activate
   
   # On Linux/Mac:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file in the `mcp-server/` directory:
   ```env
   R2_ACCESS_KEY=your_access_key_here
   R2_SECRET_KEY=your_secret_key_here
   R2_BUCKET_NAME=vm-personal-website
   R2_ENDPOINT=https://b1d89b04dac23ca559dcfb1d5c79f341.r2.cloudflarestorage.com
   R2_ACCOUNT_ID=b1d89b04dac23ca559dcfb1d5c79f341
   
   # Optional: For triggering automatic rebuilds
   CF_API_TOKEN=your_cloudflare_api_token
   CF_ACCOUNT_ID=b1d89b04dac23ca559dcfb1d5c79f341
   CF_WORKER_NAME=vm-personal
   ```
   
   Or simply copy from the parent directory:
   ```bash
   # Copy credentials from parent .env.local
   echo "R2_ACCESS_KEY=$(grep R2_ACCESS_KEY ../.env.local | cut -d= -f2)" > .env
   echo "R2_SECRET_KEY=$(grep R2_SECRET_KEY ../.env.local | cut -d= -f2)" >> .env
   echo "R2_BUCKET_NAME=vm-personal-website" >> .env
   echo "R2_ENDPOINT=https://b1d89b04dac23ca559dcfb1d5c79f341.r2.cloudflarestorage.com" >> .env
   echo "R2_ACCOUNT_ID=b1d89b04dac23ca559dcfb1d5c79f341" >> .env
   ```

## Running the MCP Server

1. **Activate the virtual environment** (if not already active):
   ```bash
   # Windows:
   .\venv\Scripts\activate
   
   # Linux/Mac:
   source venv/bin/activate
   ```

2. **Start the MCP server**:
   ```bash
   python server.py
   ```

   The server will start and listen for MCP protocol messages on stdio.

## Configuring GitHub Copilot

To use this MCP server with GitHub Copilot, you need to configure it in VS Code:

1. **Open VS Code Settings** (JSON format)
2. **Add the MCP server configuration**:

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "When working with R2 storage for the vm-personal project, use the r2-manager MCP server"
    }
  ],
  "mcp.servers": {
    "r2-manager": {
      "command": "python",
      "args": ["c:/Users/maiagrawal/personal-projects/vm-personal/mcp-server/server.py"],
      "env": {
        "PYTHONPATH": "c:/Users/maiagrawal/personal-projects/vm-personal/mcp-server"
      }
    }
  }
}
```

**Note**: Adjust the paths according to your actual project location.

## Available Tools

The MCP server provides the following tools that you can invoke through GitHub Copilot:

### 1. `list_r2_files`
Lists all files in the R2 bucket or filters by prefix.

**Parameters**:
- `prefix` (optional): Filter files by prefix (e.g., "class-X-physics/Laws_Of_Motion")

**Example prompt**:
> "Show me all files in class-X-physics"

### 2. `upload_r2_file`
Uploads a file to the R2 bucket.

**Parameters**:
- `key`: The full path where to store the file (e.g., "class-X-physics/Laws_Of_Motion/chapter1.pdf")
- `file_path`: Local path to the file to upload
- `content_type` (optional): MIME type of the file

**Example prompt**:
> "Upload the file at C:/Documents/physics-notes.pdf to class-X-physics/Laws_Of_Motion/"

### 3. `delete_r2_file`
Deletes a file from the R2 bucket.

**Parameters**:
- `key`: The full path of the file to delete

**Example prompt**:
> "Delete the file class-X-physics/Laws_Of_Motion/old-notes.pdf"

### 4. `update_r2_file`
Replaces an existing file with a new version.

**Parameters**:
- `key`: The full path of the file to update
- `file_path`: Local path to the new file
- `content_type` (optional): MIME type of the file

**Example prompt**:
> "Update class-X-physics/Laws_Of_Motion/chapter1.pdf with the file at C:/Documents/updated-notes.pdf"

### 5. `read_r2_file`
Reads the content of a text file from R2 (useful for videos.txt).

**Parameters**:
- `key`: The full path of the file to read

**Example prompt**:
> "Show me the contents of class-X-physics/Laws_Of_Motion/videos.txt"

### 6. `write_r2_file`
Writes text content directly to R2 (useful for videos.txt).

**Parameters**:
- `key`: The full path where to store the file
- `content`: The text content to write

**Example prompt**:
> "Add the YouTube URL https://www.youtube.com/watch?v=abc123 to class-X-physics/Laws_Of_Motion/videos.txt"

### 7. `get_bucket_structure`
Analyzes and displays the hierarchical structure of the R2 bucket.

**Parameters**: None

**Example prompt**:
> "Show me the R2 bucket structure"

### 8. `trigger_rebuild`
Triggers a rebuild of the Cloudflare Workers deployment to reflect R2 changes on the website.

**Parameters**: None

**Example prompt**:
> "Rebuild the website to show my changes"
> "Trigger a deployment rebuild"

**Note**: Requires `CF_API_TOKEN` to be configured in `.env`

## R2 Bucket Structure

Your R2 bucket follows this structure:
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
- Example: `class-X-physics/Laws_Of_Motion/chapter1.pdf`

## Usage Examples with GitHub Copilot

Once configured, you can use natural language prompts with GitHub Copilot:

1. **List files**:
   - "Show me all physics files for class X"
   - "List all files in the Laws of Motion topic"

2. **Upload files**:
   - "Upload this PDF to class X physics, Laws of Motion topic"
   - "Add a new document to class XI gravitation"

3. **Manage videos**:
   - "Add this YouTube video to class X physics Laws of Motion"
   - "Show me all video URLs for class XII Wave Optics"

4. **Delete files**:
   - "Remove the old chapter1.pdf from Laws of Motion"
   - "Delete all files in the test topic"

5. **Update files**:
   - "Replace the chapter2.pdf in Laws of Motion with this new version"

6. **Trigger rebuild**:
   - "Rebuild the website"
   - "Trigger a deployment to show my changes"

## Workflow

1. **Start the MCP server** (run `python server.py` in the mcp-server directory)
2. **Open GitHub Copilot Chat** in VS Code
3. **Give natural language commands** like "List all files in class-X-physics"
4. **GitHub Copilot will use the MCP tools** to interact with R2
5. **After making changes**, you can either:
   - Use the `trigger_rebuild` tool to automatically rebuild: "Rebuild the website"
   - Or manually rebuild:
     ```bash
     cd ..
     npm run build
     ```

## Troubleshooting

### Server won't start
- Check that your virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Ensure `.env` file exists with correct credentials

### GitHub Copilot can't find the server
- Verify the path in VS Code settings matches your actual project location
- Check that the server is running (you should see startup messages)
- Restart VS Code after updating settings

### R2 operations fail
- Verify your R2 credentials in `.env` are correct
- Check that the bucket name matches: `vm-personal-website`
- Ensure your R2 API token has read/write permissions

### Rebuild trigger fails
- Verify your Cloudflare API token in `.env` is correct
- Ensure `CF_API_TOKEN` has Workers Scripts:Edit permissions
- Check that `CF_WORKER_NAME` matches your worker name (default: `vm-personal`)
- Verify your `CF_ACCOUNT_ID` is correct

## Development

The MCP server is implemented in Python using:
- `mcp` - Model Context Protocol SDK
- `boto3` - AWS S3-compatible client for R2
- `requests` - HTTP library for Cloudflare API calls
- `python-dotenv` - Environment variable management

To modify the server:
1. Edit `server.py` to add new tools or modify existing ones
2. Restart the server to apply changes
3. No need to rebuild the website

## Security Notes

- The `.env` file contains sensitive credentials - **never commit it to Git**
- The MCP server runs locally and does not expose any network ports
- All R2 operations use your personal credentials
- Consider using read-only tokens if you only need to list files

## License

This MCP server is part of the vm-personal project.
