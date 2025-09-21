import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000;
const R2_BUCKET_NAME = "vm-personal-website";
const R2_ENDPOINT = "https://b1d89b04dac23ca559dcfb1d5c79f341.r2.cloudflarestorage.com";

interface Env {
  "vm-personal-r2": R2Bucket;
}

export type R2Document = {
  key: string;
  size: number; // Size in bytes
  uploaded: Date; // Date when the document was uploaded
  url: string; // Public URL to access the document
};

export async function listDocumentsFromR2(): Promise<R2Document[]> {
  // Fetch all objects in my R2 bucket using S3-compatible API
  const s3 = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY!,
      secretAccessKey: process.env.R2_SECRET_KEY!,
    },
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await s3.send(
        new ListObjectsV2Command({
          Bucket: R2_BUCKET_NAME,
        })
      );

      return (
        result.Contents?.map((obj) => ({
          key: obj.Key!,
          size: obj.Size || 0,
          uploaded: obj.LastModified || new Date(),
          url: `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${obj.Key}`,
        })) ?? []
      );
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
export async function listDocumentsFromR2Binding(env: Env): Promise<R2Document[]> {
  try {
    const r2Bucket = env["vm-personal-r2"];
    const objects = await r2Bucket.list();
    
    return objects.objects.map((obj) => ({
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
export const fetchDocumentsFromR2 = listDocumentsFromR2;

// Smart function that detects environment and uses appropriate method
export async function getDocumentsFromR2(env?: Env): Promise<R2Document[]> {
  // If env is provided and we have R2 binding, use it (Cloudflare Workers environment)
  if (env && env["vm-personal-r2"]) {
    return listDocumentsFromR2Binding(env);
  }
  
  // Otherwise, use S3-compatible API (local development or other environments)
  return listDocumentsFromR2();
}

// TODO: Implement method to get content of videos.xml file for a specific grade and subject
// This will likely involve fetching the XML file from R2 and parsing it

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}