import type { TeacherProfile, ResourceCategory, MaterialContent, VideoResource, DocumentResource } from '@/types';
import { File, FileArchive, FileText } from 'lucide-react';

const mockTeacherProfile: TeacherProfile = {
  name: 'Dr. Evelyn Reed',
  title: 'Physics Educator',
  credentials: ['Ph.D. in Theoretical Physics', 'M.Sc. in Physics', 'B.Ed.'],
  experience: [
    '15+ years teaching Physics at Northwood High',
    'Recipient of the "Excellence in Teaching" award (2020)',
    "Authored 'Concepts of Modern Physics' supplementary guide",
    'Conducted various science workshops for students and educators',
  ],
  photoUrl: 'https://placehold.co/300x300.png',
  bio: 'A passionate educator dedicated to making physics accessible and exciting for all students. Dr. Reed believes in fostering a curious mindset and a deep understanding of the natural world through engaging lectures and practical resources.',
};

const mockResourceCategories: ResourceCategory[] = [
  {
    id: '1',
    grade: 'Class IX',
    subject: 'Physics',
    title: 'Class IX | Physics',
    description: 'Fundamental concepts of motion, force, energy, and sound for 9th graders.',
    slug: 'class-9/physics',
  },
  {
    id: '2',
    grade: 'Class X',
    subject: 'Physics',
    title: 'Class X | Physics',
    description: 'Exploring light, electricity, magnetism, and sources of energy for 10th graders.',
    slug: 'class-10/physics',
  },
  {
    id: '3',
    grade: 'Class XI',
    subject: 'Physics',
    title: 'Class XI | Physics',
    description: 'Advanced topics including mechanics, thermodynamics, and waves for 11th graders.',
    slug: 'class-11/physics',
  },
  {
    id: '4',
    grade: 'Class XII',
    subject: 'Physics',
    title: 'Class XII | Physics',
    description: 'In-depth study of electrostatics, optics, modern physics, and semiconductors for 12th graders.',
    slug: 'class-12/physics',
  },
];

const commonVideos: VideoResource[] = [
  { id: 'v1', title: 'Introduction to Kinematics', thumbnailUrl: 'https://placehold.co/320x180.png', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:20', description: 'Understanding motion, displacement, velocity, and acceleration.' },
  { id: 'v2', title: 'Newton\'s Laws of Motion', thumbnailUrl: 'https://placehold.co/320x180.png', embedUrl: 'https://www.youtube.com/embed/oHg5SJYRHA0', duration: '22:05', description: 'Detailed explanation of Newton\'s three laws with examples.' },
  { id: 'v3', title: 'Work, Energy, and Power', thumbnailUrl: 'https://placehold.co/320x180.png', embedUrl: 'https://www.youtube.com/embed/6zZWWg_S_mw', duration: '18:45', description: 'Concepts of work, different forms of energy, and power calculations.' },
];

const commonDocuments: DocumentResource[] = [
  { id: 'd1', title: 'Chapter 1 Notes - Units and Measurements.pdf', type: 'pdf', icon: File, downloadUrl: '#', uploadDate: '2024-05-10T10:00:00Z', fileSize: '1.2MB' },
  { id: 'd2', title: 'Practice Problems - Motion.docx', type: 'doc', icon: FileArchive, downloadUrl: '#', uploadDate: '2024-05-15T14:30:00Z', fileSize: '0.8MB' },
  { id: 'd3', title: 'Lab Report Guidelines.txt', type: 'txt', icon: FileText, downloadUrl: '#', uploadDate: '2024-04-20T09:00:00Z', fileSize: '0.1MB' },
  { id: 'd4', title: 'Syllabus Overview.pdf', type: 'pdf', icon: File, downloadUrl: '#', uploadDate: '2024-03-01T12:00:00Z', fileSize: '0.5MB' },
];

const mockMaterialContents: Record<string, MaterialContent> = {
  'class-9/physics': {
    grade: 'Class IX',
    subject: 'Physics',
    title: 'Class IX Physics Resources',
    videos: [
      ...commonVideos,
      { id: 'v4_9', title: 'Gravitation Basics', thumbnailUrl: 'https://placehold.co/320x180.png', embedUrl: 'https://www.youtube.com/embed/yDqGzB6P5Y0', duration: '20:10', description: 'Understanding universal gravitation and its effects.' },
    ],
    documents: [
      ...commonDocuments,
      { id: 'd5_9', title: 'Sound Waves Explained.pdf', type: 'pdf', icon: File, downloadUrl: '#', uploadDate: '2024-05-01T11:00:00Z', fileSize: '1.5MB' },
    ].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()),
  },
  'class-10/physics': {
    grade: 'Class X',
    subject: 'Physics',
    title: 'Class X Physics Resources',
    videos: [
      ...commonVideos,
      { id: 'v4_10', title: 'Optics: Reflection and Refraction', thumbnailUrl: 'https://placehold.co/320x180.png', embedUrl: 'https://www.youtube.com/embed/U2R2D02XGL0', duration: '25:50', description: 'Laws of reflection and refraction, lenses and mirrors.' },
    ],
    documents: [
      ...commonDocuments,
      { id: 'd5_10', title: 'Electricity Numericals.docx', type: 'doc', icon: FileArchive, downloadUrl: '#', uploadDate: '2024-05-05T16:00:00Z', fileSize: '0.9MB' },
    ].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()),
  },
   'class-11/physics': {
    grade: 'Class XI',
    subject: 'Physics',
    title: 'Class XI Physics Resources',
    videos: [
      ...commonVideos,
      { id: 'v4_11', title: 'Thermodynamics Part 1', thumbnailUrl: 'https://placehold.co/320x180.png', embedUrl: 'https://www.youtube.com/embed/5P0_Y00pQ7o', duration: '28:15', description: 'Introduction to thermodynamic systems and laws.' },
    ],
    documents: [
      ...commonDocuments,
      { id: 'd5_11', title: 'Vector Analysis.pdf', type: 'pdf', icon: File, downloadUrl: '#', uploadDate: '2024-04-28T10:30:00Z', fileSize: '2.1MB' },
    ].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()),
  },
  'class-12/physics': {
    grade: 'Class XII',
    subject: 'Physics',
    title: 'Class XII Physics Resources',
    videos: [
      ...commonVideos,
      { id: 'v4_12', title: 'Electromagnetic Induction', thumbnailUrl: 'https://placehold.co/320x180.png', embedUrl: 'https://www.youtube.com/embed/tM0s-k19Z8Y', duration: '30:00', description: 'Faraday\'s laws and Lenz\'s law explained.' },
    ],
    documents: [
      ...commonDocuments,
      { id: 'd5_12', title: 'Modern Physics Q&A.docx', type: 'doc', icon: FileArchive, downloadUrl: '#', uploadDate: '2024-05-12T08:00:00Z', fileSize: '1.1MB' },
    ].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()),
  },
};

export async function getTeacherProfile(): Promise<TeacherProfile> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTeacherProfile;
}

export async function getResourceCategories(): Promise<ResourceCategory[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockResourceCategories;
}

export async function getMaterialContent(gradeSlug: string, subjectSlug: string): Promise<MaterialContent | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  const key = `${gradeSlug}/${subjectSlug}`;
  return mockMaterialContents[key] || null;
}
