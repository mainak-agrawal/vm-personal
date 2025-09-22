import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AwsClient } from "aws4fetch";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000;
const R2_BUCKET_NAME = "vm-personal-website";
const R2_ENDPOINT = "https://b1d89b04dac23ca559dcfb1d5c79f341.r2.cloudflarestorage.com";

// Helper function to parse ListObjectsV2 XML response
function parseListObjectsXml(xmlText: string): R2Document[] {
  const documents: R2Document[] = [];
  
  // Simple XML parsing for ListBucketResult
  const contentsRegex = /<Contents>([\s\S]*?)<\/Contents>/g;
  let match;
  
  while ((match = contentsRegex.exec(xmlText)) !== null) {
    const contentXml = match[1];
    
    // Extract Key, Size, LastModified
    const keyMatch = contentXml.match(/<Key>(.*?)<\/Key>/);
    const sizeMatch = contentXml.match(/<Size>(.*?)<\/Size>/);
    const lastModifiedMatch = contentXml.match(/<LastModified>(.*?)<\/LastModified>/);
    
    if (keyMatch) {
      const key = keyMatch[1];
      const size = sizeMatch ? parseInt(sizeMatch[1]) : 0;
      const uploaded = lastModifiedMatch ? new Date(lastModifiedMatch[1]) : new Date();
      
      documents.push({
        key,
        size,
        uploaded,
        url: `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${key}`,
      });
    }
  }
  
  return documents;
}

export type R2Document = {
  key: string;
  size: number; // Size in bytes
  uploaded: Date; // Date when the document was uploaded
  url: string; // Public URL to access the document
};

export async function listDocumentsFromR2(): Promise<R2Document[]> {
  // Initialize aws4fetch client for R2
  const client = new AwsClient({
    service: "s3",
    region: "auto",
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Use aws4fetch to list objects
      const response = await client.fetch(
        `${R2_ENDPOINT}/${R2_BUCKET_NAME}?list-type=2`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      
      // Parse XML response to extract object information
      const documents = parseListObjectsXml(xmlText);
      return documents;
    } catch (err) {
      console.warn(`R2 list attempt ${attempt} failed:`, err);
      if (attempt < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      } else {
        throw new Error("Failed to list R2 documents after retries.");
      }
    }
  }

  return [];
}

// Alternative function using Cloudflare R2 bindings (for Cloudflare Workers environment)
export async function listDocumentsFromR2Binding(env: any): Promise<R2Document[]> {
  try {
    const r2Bucket = env["vm-personal-r2"];
    const objects = await r2Bucket.list();
    
    return objects.objects.map((obj: any) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      url: `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${obj.key}`,
    }));
  } catch (err) {
    console.error("Failed to list R2 documents using binding:", err);
    throw new Error("Failed to list R2 documents using binding.");
  }
}

// Alias for backward compatibility
export const fetchDocumentsFromR2 = getDocumentsFromR2;

// Smart function that detects environment and uses appropriate method
export async function getDocumentsFromR2(env?: any): Promise<R2Document[]> {
  // If env is provided and we have R2 binding, use it (Cloudflare Workers environment)
  if (env && env["vm-personal-r2"]) {
    return listDocumentsFromR2Binding(env);
  }

  // Otherwise, use S3-compatible API (local development or other environments)
  return listDocumentsFromR2();
}

// TODO: Implement method to get content of videos.xml file for a specific grade and subject
// This will likely involve fetching the text file from R2 and parsing it
// Import GetObjectCommand for fetching file contents

// Get file content using aws4fetch
export async function getFileContentUsingS3Api(filePath: string): Promise<string> {
  const client = new AwsClient({
    service: "s3",
    region: "auto",
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.fetch(
        `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${filePath}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const bodyContents = await response.text();
      if (!bodyContents) {
        throw new Error(`Empty file content for ${filePath}`);
      }
      
      return bodyContents;
    } catch (err) {
      console.warn(`R2 get file attempt ${attempt} failed for ${filePath}:`, err);
      if (attempt < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      } else {
        throw new Error(`Failed to get file ${filePath} after retries.`);
      }
    }
  }
  
  throw new Error(`Failed to get file ${filePath}`);
}

// Get file content using Cloudflare R2 bindings
export async function getFileContentUsingR2Binding(filePath: string, env: any): Promise<string> {
  try {
    const r2Bucket = env["vm-personal-r2"];
    const object = await r2Bucket.get(filePath);
    
    if (!object) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    return await object.text();
  } catch (err) {
    console.error(`Failed to get file ${filePath} using binding:`, err);
    throw new Error(`Failed to get file ${filePath} using binding.`);
  }
}

// Smart function that detects environment and uses appropriate method
export async function getFileFromR2(filePath: string, env?: any): Promise<string> {
  // If env is provided and we have R2 binding, use it (Cloudflare Workers environment)
  if (env && env["vm-personal-r2"]) {
    return getFileContentUsingR2Binding(filePath, env);
  }

  // Otherwise, use S3-compatible API (local development or other environments)
  return getFileContentUsingS3Api(filePath);
}

/**
 * Creates a YouTube oEmbed API URL for fetching video metadata in JSON format
 * @param youtubeUrl The YouTube video URL
 * @returns The complete oEmbed API URL
 */
export function createYoutubeOembedUrl(youtubeUrl: string): string {
  return `https://www.youtube.com/oembed?url=${youtubeUrl}&format=json`;
}

/**
 * Interface for YouTube oEmbed API response
 */
export interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
}

/**
 * Fetches YouTube video metadata from oEmbed API
 * @param oembedUrl The YouTube oEmbed API URL
 * @returns Promise containing the parsed JSON response
 */
export async function fetchYoutubeOembedData(oembedUrl: string): Promise<YouTubeOEmbedResponse> {
  try {
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch oEmbed data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as YouTubeOEmbedResponse;
  } catch (error) {
    console.error("Error fetching YouTube oEmbed data:", error);
    throw new Error("Failed to fetch YouTube video metadata");
  }
}

/**
 * Fetches and processes a list of YouTube videos from a text file stored in R2
 * @param filePath Path to the text file in R2 containing YouTube URLs (one per line)
 * @param env Optional R2 environment bindings
 * @returns Map of youtube metadata objects
 */
export async function getYoutubeVideosFromR2File(filePath: string, env?: any): Promise<Map<string, YouTubeOEmbedResponse>> {
  try {
    // Fetch the file content from R2
    const fileContent = await getFileFromR2(filePath, env);
    
    // Split the content by lines and filter out any empty lines
    const youtubeUrls = fileContent.split('\n').filter(url => url.trim() !== '');
    
    // Process each URL to fetch metadata
    // Create a map to store URL -> oEmbed data mapping
    const videoMap = new Map<string, YouTubeOEmbedResponse>();
    
    // Process each URL sequentially to maintain the mapping
    for (const url of youtubeUrls) {
      const trimmedUrl = url.trim();
      if (trimmedUrl) {
      const oembedUrl = createYoutubeOembedUrl(trimmedUrl);
      const oembedData = await fetchYoutubeOembedData(oembedUrl);
      videoMap.set(trimmedUrl, oembedData);
      }
    }
    
    return videoMap;
  } catch (error) {
    console.error(`Error processing YouTube videos from ${filePath}:`, error);
    throw new Error(`Failed to process YouTube videos from file ${filePath}`);
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}