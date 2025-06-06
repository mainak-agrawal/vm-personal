
import type { LucideIcon } from 'lucide-react';

export interface AcademicProfile {
  degree: string; // e.g., "B.Tech, IIT Delhi (1988)"
  points: string[]; // e.g., ["All India JEE Rank: 201", "CGPA: 7.87/10.00"]
}

export interface ProfessionalProfileSection {
  heading: string; // e.g., "Experience", "Specialization"
  points: string[];
}

export interface TeacherProfile {
  name: string;
  title: string;
  photoUrl: string;
  bio: string;
  academicProfiles: AcademicProfile[];
  professionalSections: ProfessionalProfileSection[];
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
  uploadDate?: string; // ISO date string, conceptually from XML file's modifiedTime or data within XML
}

export type DocumentType = 'pdf' | 'doc' | 'docx' | 'txt' | 'file'; // 'file' for generic/unknown
export type DocumentIconName = 'File' | 'FileArchive' | 'FileText';

export interface DocumentResource {
  id: string; // Will be Google Drive File ID
  title: string;
  type: DocumentType;
  icon: DocumentIconName;
  downloadUrl: string; // Direct Google Drive download link
  uploadDate: string; // ISO date string from Drive's modifiedTime
  fileSize?: string; // e.g., "2.5 MB" from Drive's size
}

export interface MaterialContent {
  grade: string;
  subject: string;
  title: string; // e.g. "Class X Physics Resources"
  videos: VideoResource[];
  documents: DocumentResource[];
}
