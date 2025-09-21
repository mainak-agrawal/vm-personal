# Cloudflare R2 Setup

This project uses Cloudflare R2 for object storage. Here's how to set it up:

## For Local Development

1. Create a `.env.local` file based on `.env.example`
2. Get your R2 API credentials from Cloudflare Dashboard:
   - Go to R2 Object Storage > Manage R2 API tokens
   - Create an API token with read permissions for your bucket
   - Add the Access Key ID and Secret Access Key to your `.env.local`

## For Cloudflare Workers Deployment

The project is configured to use R2 bindings when deployed to Cloudflare Workers:

- Binding name: `vm-personal-r2`
- Bucket name: `vm-personal-website`

This is already configured in `wrangler.jsonc`.

## Bucket Structure

The application expects files to be organized as:
```
bucket/
├── class-10-physics/
│   ├── document1.pdf
│   ├── document2.docx
│   └── videos.xml
├── class-11-chemistry/
│   ├── document3.pdf
│   └── videos.xml
└── ...
```

Where the folder names follow the pattern: `class-{grade}-{subject}`

## Functions Available

- `listDocumentsFromR2()` - Uses S3-compatible API (for local dev)
- `listDocumentsFromR2Binding(env)` - Uses R2 bindings (for Workers)
- `getDocumentsFromR2(env?)` - Smart function that detects environment
- `fetchDocumentsFromR2()` - Alias for backward compatibility
