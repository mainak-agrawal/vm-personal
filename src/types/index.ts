import type { LucideIcon } from 'lucide-react';

export interface TeacherProfile {
  name: string;
  title: string;
  credentials: string[];
  experience: string[];
  photoUrl: string;
  bio: string;
}

export interface ResourceCategory {
  id: string;
  grade: string;
  subject: string;
  title: string;
  description: string;
  slug: string; // e.g., "class-10/physics"
}

export interface VideoResource {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  embedUrl: string; // YouTube embed URL
  duration?: string; // e.g., "12:34"
}

export type DocumentType = 'pdf' | 'doc' | 'txt';

export interface DocumentResource {
  id: string;
  title: string;
  type: DocumentType;
  icon: LucideIcon;
  downloadUrl: string;
  uploadDate: string; // ISO date string for sorting
  fileSize?: string; // e.g., "2.5 MB"
}

export interface MaterialContent {
  grade: string;
  subject: string;
  title: string; // e.g. "Class X Physics Resources"
  videos: VideoResource[];
  documents: DocumentResource[];
}
