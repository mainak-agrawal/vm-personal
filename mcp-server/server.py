#!/usr/bin/env python3
"""
MCP Server for managing Cloudflare R2 storage for the vm-personal website.

This server provides tools to list, upload, delete, and update files in the R2 bucket
that stores educational resources for the website.
"""

import os
import sys
import json
import boto3
import requests
from pathlib import Path
from typing import Any, Sequence
from dotenv import load_dotenv
from mcp.server import Server
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from mcp.server.stdio import stdio_server

# Load environment variables
load_dotenv()

# R2 Configuration
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "vm-personal-website")
R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")

# Cloudflare Workers Configuration
CF_API_TOKEN = os.getenv("CF_API_TOKEN")
CF_ACCOUNT_ID = os.getenv("CF_ACCOUNT_ID", R2_ACCOUNT_ID)
CF_WORKER_NAME = os.getenv("CF_WORKER_NAME", "vm-personal")

# Validate configuration
if not all([R2_ACCESS_KEY, R2_SECRET_KEY, R2_ENDPOINT, R2_ACCOUNT_ID]):
    print("Error: Missing required R2 configuration in .env file", file=sys.stderr)
    print("Required variables: R2_ACCESS_KEY, R2_SECRET_KEY, R2_ENDPOINT, R2_ACCOUNT_ID", file=sys.stderr)
    sys.exit(1)

# Initialize S3 client for R2
s3_client = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    region_name="auto"
)

# Create MCP server instance
server = Server("r2-manager")

@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools for R2 management."""
    return [
        Tool(
            name="list_r2_files",
            description="List all files in the R2 bucket, optionally filtered by prefix (e.g., 'class-X-physics/Laws_Of_Motion'). Returns file keys, sizes, and last modified dates.",
            inputSchema={
                "type": "object",
                "properties": {
                    "prefix": {
                        "type": "string",
                        "description": "Optional prefix to filter files (e.g., 'class-X-physics' or 'class-X-physics/Laws_Of_Motion')"
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="upload_r2_file",
            description="Upload a file to the R2 bucket. The key should follow the format: {grade-subject}/{topic}/{filename}. Example: 'class-X-physics/Laws_Of_Motion/chapter1.pdf'",
            inputSchema={
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "The full path/key where the file will be stored in R2 (e.g., 'class-X-physics/Laws_Of_Motion/chapter1.pdf')"
                    },
                    "file_path": {
                        "type": "string",
                        "description": "Local file path to upload"
                    },
                    "content_type": {
                        "type": "string",
                        "description": "MIME type of the file (optional, will be auto-detected if not provided)"
                    }
                },
                "required": ["key", "file_path"]
            }
        ),
        Tool(
            name="delete_r2_file",
            description="Delete a file from the R2 bucket by its key.",
            inputSchema={
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "The full path/key of the file to delete"
                    }
                },
                "required": ["key"]
            }
        ),
        Tool(
            name="update_r2_file",
            description="Update an existing file in R2 by replacing it with a new version. This is equivalent to uploading with the same key.",
            inputSchema={
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "The full path/key of the file to update"
                    },
                    "file_path": {
                        "type": "string",
                        "description": "Local file path of the new version"
                    },
                    "content_type": {
                        "type": "string",
                        "description": "MIME type of the file (optional)"
                    }
                },
                "required": ["key", "file_path"]
            }
        ),
        Tool(
            name="read_r2_file",
            description="Read the content of a text file from R2 (useful for videos.txt or other text files). Returns the file content as text.",
            inputSchema={
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "The full path/key of the file to read"
                    }
                },
                "required": ["key"]
            }
        ),
        Tool(
            name="write_r2_file",
            description="Write text content directly to a file in R2 (useful for creating/updating videos.txt). Creates or replaces the file with the provided content.",
            inputSchema={
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "The full path/key where to write the file (e.g., 'class-X-physics/Laws_Of_Motion/videos.txt')"
                    },
                    "content": {
                        "type": "string",
                        "description": "The text content to write to the file"
                    }
                },
                "required": ["key", "content"]
            }
        ),
        Tool(
            name="get_bucket_structure",
            description="Analyze and return the hierarchical structure of the R2 bucket, showing grades, subjects, and topics. Useful for understanding the organization.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        Tool(
            name="trigger_rebuild",
            description="Trigger a rebuild of the Cloudflare Workers deployment to reflect the latest R2 storage changes on the website. This uses the Cloudflare API to redeploy the worker.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: Any) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
    """Handle tool calls."""
    
    try:
        if name == "list_r2_files":
            prefix = arguments.get("prefix", "")
            
            try:
                # List objects with optional prefix
                response = s3_client.list_objects_v2(
                    Bucket=R2_BUCKET_NAME,
                    Prefix=prefix
                )
                
                if "Contents" not in response:
                    return [TextContent(
                        type="text",
                        text=f"No files found{' with prefix: ' + prefix if prefix else ''}."
                    )]
                
                files = []
                for obj in response["Contents"]:
                    files.append({
                        "key": obj["Key"],
                        "size": obj["Size"],
                        "last_modified": obj["LastModified"].isoformat(),
                        "size_kb": round(obj["Size"] / 1024, 2)
                    })
                
                # Format output
                output = f"Found {len(files)} file(s){' with prefix: ' + prefix if prefix else ''}:\n\n"
                for file in files:
                    output += f"📄 {file['key']}\n"
                    output += f"   Size: {file['size_kb']} KB\n"
                    output += f"   Last Modified: {file['last_modified']}\n\n"
                
                return [TextContent(type="text", text=output)]
                
            except Exception as e:
                return [TextContent(type="text", text=f"Error listing files: {str(e)}")]
        
        elif name == "upload_r2_file":
            key = arguments["key"]
            file_path = arguments["file_path"]
            content_type = arguments.get("content_type")
            
            # Replace spaces with underscores in the key path
            key = key.replace(" ", "_")
            
            try:
                # Check if local file exists
                if not os.path.exists(file_path):
                    return [TextContent(type="text", text=f"Error: Local file not found: {file_path}")]
                
                # Auto-detect content type if not provided
                if not content_type:
                    ext = Path(file_path).suffix.lower()
                    content_type_map = {
                        ".pdf": "application/pdf",
                        ".doc": "application/msword",
                        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        ".txt": "text/plain",
                        ".jpg": "image/jpeg",
                        ".jpeg": "image/jpeg",
                        ".png": "image/png",
                        ".mp4": "video/mp4",
                        ".zip": "application/zip"
                    }
                    content_type = content_type_map.get(ext, "application/octet-stream")
                
                # Upload file
                file_size = os.path.getsize(file_path)
                with open(file_path, "rb") as f:
                    s3_client.put_object(
                        Bucket=R2_BUCKET_NAME,
                        Key=key,
                        Body=f,
                        ContentType=content_type
                    )
                
                return [TextContent(
                    type="text",
                    text=f"✅ Successfully uploaded file to R2:\n\nKey: {key}\nSize: {round(file_size / 1024, 2)} KB\nContent-Type: {content_type}\n\nDon't forget to rebuild the website to reflect this change!"
                )]
                
            except Exception as e:
                return [TextContent(type="text", text=f"Error uploading file: {str(e)}")]
        
        elif name == "delete_r2_file":
            key = arguments["key"]
            
            try:
                # Check if file exists
                try:
                    s3_client.head_object(Bucket=R2_BUCKET_NAME, Key=key)
                except:
                    return [TextContent(type="text", text=f"Error: File not found in R2: {key}")]
                
                # Delete file
                s3_client.delete_object(Bucket=R2_BUCKET_NAME, Key=key)
                
                return [TextContent(
                    type="text",
                    text=f"✅ Successfully deleted file from R2: {key}\n\nDon't forget to rebuild the website to reflect this change!"
                )]
                
            except Exception as e:
                return [TextContent(type="text", text=f"Error deleting file: {str(e)}")]
        
        elif name == "update_r2_file":
            # Update is the same as upload - just replace the file
            key = arguments["key"]
            file_path = arguments["file_path"]
            content_type = arguments.get("content_type")
            
            try:
                # Check if file exists in R2
                try:
                    s3_client.head_object(Bucket=R2_BUCKET_NAME, Key=key)
                except:
                    return [TextContent(type="text", text=f"Warning: File does not exist in R2, creating new file: {key}")]
                
                # Check if local file exists
                if not os.path.exists(file_path):
                    return [TextContent(type="text", text=f"Error: Local file not found: {file_path}")]
                
                # Auto-detect content type if not provided
                if not content_type:
                    ext = Path(file_path).suffix.lower()
                    content_type_map = {
                        ".pdf": "application/pdf",
                        ".doc": "application/msword",
                        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        ".txt": "text/plain",
                        ".jpg": "image/jpeg",
                        ".jpeg": "image/jpeg",
                        ".png": "image/png",
                        ".mp4": "video/mp4",
                        ".zip": "application/zip"
                    }
                    content_type = content_type_map.get(ext, "application/octet-stream")
                
                # Upload (replace) file
                file_size = os.path.getsize(file_path)
                with open(file_path, "rb") as f:
                    s3_client.put_object(
                        Bucket=R2_BUCKET_NAME,
                        Key=key,
                        Body=f,
                        ContentType=content_type
                    )
                
                return [TextContent(
                    type="text",
                    text=f"✅ Successfully updated file in R2:\n\nKey: {key}\nNew Size: {round(file_size / 1024, 2)} KB\nContent-Type: {content_type}\n\nDon't forget to rebuild the website to reflect this change!"
                )]
                
            except Exception as e:
                return [TextContent(type="text", text=f"Error updating file: {str(e)}")]
        
        elif name == "read_r2_file":
            key = arguments["key"]
            
            try:
                # Get object from R2
                response = s3_client.get_object(Bucket=R2_BUCKET_NAME, Key=key)
                content = response["Body"].read().decode("utf-8")
                
                return [TextContent(
                    type="text",
                    text=f"📄 Content of {key}:\n\n{content}"
                )]
                
            except Exception as e:
                return [TextContent(type="text", text=f"Error reading file: {str(e)}")]
        
        elif name == "write_r2_file":
            key = arguments["key"]
            content = arguments["content"]
            
            try:
                # Write content to R2
                s3_client.put_object(
                    Bucket=R2_BUCKET_NAME,
                    Key=key,
                    Body=content.encode("utf-8"),
                    ContentType="text/plain"
                )
                
                return [TextContent(
                    type="text",
                    text=f"✅ Successfully wrote content to R2: {key}\n\nSize: {len(content)} bytes\n\nDon't forget to rebuild the website to reflect this change!"
                )]
                
            except Exception as e:
                return [TextContent(type="text", text=f"Error writing file: {str(e)}")]
        
        elif name == "get_bucket_structure":
            try:
                # List all objects
                response = s3_client.list_objects_v2(Bucket=R2_BUCKET_NAME)
                
                if "Contents" not in response:
                    return [TextContent(type="text", text="No files found in bucket.")]
                
                # Organize by grade-subject and topic
                structure = {}
                for obj in response["Contents"]:
                    parts = obj["Key"].split("/")
                    if len(parts) >= 3:
                        grade_subject = parts[0]
                        topic = parts[1]
                        filename = parts[2]
                        
                        if grade_subject not in structure:
                            structure[grade_subject] = {}
                        if topic not in structure[grade_subject]:
                            structure[grade_subject][topic] = []
                        
                        structure[grade_subject][topic].append({
                            "filename": filename,
                            "size_kb": round(obj["Size"] / 1024, 2)
                        })
                
                # Format output
                output = "📚 R2 Bucket Structure:\n\n"
                for grade_subject in sorted(structure.keys()):
                    output += f"📂 {grade_subject}\n"
                    for topic in sorted(structure[grade_subject].keys()):
                        output += f"  📁 {topic}\n"
                        for file_info in structure[grade_subject][topic]:
                            output += f"    📄 {file_info['filename']} ({file_info['size_kb']} KB)\n"
                    output += "\n"
                
                return [TextContent(type="text", text=output)]
                
            except Exception as e:
                return [TextContent(type="text", text=f"Error analyzing bucket structure: {str(e)}")]
        
        elif name == "trigger_rebuild":
            try:
                # Check if CF_API_TOKEN is configured
                if not CF_API_TOKEN:
                    return [TextContent(
                        type="text",
                        text="❌ Error: CF_API_TOKEN not configured in .env file.\n\nTo enable automatic rebuilds, add your Cloudflare API token to the .env file."
                    )]
                
                # Trigger deployment using Cloudflare Workers API
                # The API endpoint to redeploy a worker
                url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/workers/scripts/{CF_WORKER_NAME}/deployments"
                
                headers = {
                    "Authorization": f"Bearer {CF_API_TOKEN}",
                    "Content-Type": "application/json"
                }
                
                # Get current deployment to trigger a rebuild
                response = requests.post(url, headers=headers, json={})
                
                if response.status_code in [200, 201, 202]:
                    return [TextContent(
                        type="text",
                        text=f"✅ Successfully triggered rebuild for worker '{CF_WORKER_NAME}'!\n\nThe website will be updated shortly to reflect your R2 storage changes.\n\nNote: It may take a few minutes for the changes to propagate."
                    )]
                else:
                    error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                    error_msg = error_data.get('errors', [{}])[0].get('message', response.text) if error_data.get('errors') else response.text
                    return [TextContent(
                        type="text",
                        text=f"❌ Failed to trigger rebuild.\n\nStatus Code: {response.status_code}\nError: {error_msg}\n\nPlease check your CF_API_TOKEN and ensure it has the necessary permissions."
                    )]
                
            except Exception as e:
                return [TextContent(type="text", text=f"Error triggering rebuild: {str(e)}")]
        
        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]
    
    except Exception as e:
        return [TextContent(type="text", text=f"Error executing tool '{name}': {str(e)}")]

async def main():
    """Main entry point for the MCP server."""
    print("🚀 Starting R2 Manager MCP Server...", file=sys.stderr)
    print(f"📦 Bucket: {R2_BUCKET_NAME}", file=sys.stderr)
    print(f"🔗 Endpoint: {R2_ENDPOINT}", file=sys.stderr)
    print("✅ Server ready for connections", file=sys.stderr)

    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
