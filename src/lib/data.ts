
import type { TeacherProfile, ResourceCategory, MaterialContent, VideoResource, DocumentResource, DocumentIconName, DocumentType, AcademicProfile, ProfessionalProfileSection } from '@/types';

const mockTeacherProfile: TeacherProfile = {
  name: 'Vishva Mohan',
  title: 'Coach, Mentor, Guide.',
  photoUrl: 'https://vishvamohan.com/assets/img/vishva_photo.JPG',
  bio: 'An Ex-DM and Spl. Commissioner, Govt. of Delhi, Shri Vishva Mohan has a deep passion for teaching and mentoring. His profile is summarized below:',
  academicProfiles: [
    {
      degree: 'B.Tech, IIT Delhi (1988)',
      points: [
        'All India JEE Rank: 201',
        'CGPA: 7.87/10.00',
      ],
    },
    {
      degree: 'MBA, University of Notre Dame, USA (2005)',
      points: [
        'GMAT: 760/800',
        'TOEFL: 283/300',
        'GPA: 3.91/4.00',
      ],
    },
    {
      degree: 'UPSC IAS (Combined Civil Services) Exam (1991)',
      points: [
        'All India Rank: 479',
        'Optional Subjects: Physics and Mechanical Engineering',
      ],
    },
  ],
  professionalSections: [
    {
      heading: 'Experience',
      points: ['Over two decades of teaching and mentoring'],
    },
    {
      heading: 'Specialization',
      points: [
        'JEE (Advanced) and JEE (Main)/NEET level Physics',
        'CBSE Physics',
        'SAT: English, Reasoning/Analytical, Math',
        'Statement of Purpose (SoP) for admission to North American universities',
      ],
    },
    {
      heading: 'Proven Track Record',
      points: [
        'Many students successfully admitted to IITs, DTU, and other top institutions',
        'All those who completed UG studies have subsequently been admitted to top US universities/IIMs or are excelling in MNCs/entrepreneurship',
      ],
    },
  ],
};

const mockResourceCategories: ResourceCategory[] = [
  { id: '1', grade: 'Class IX', subject: 'Physics', title: 'Class IX | Physics', description: 'Fundamental concepts of motion, force, energy, and sound for 9th graders.', slug: 'class-9/physics' },
  { id: '2', grade: 'Class X', subject: 'Physics', title: 'Class X | Physics', description: 'Exploring light, electricity, magnetism, and sources of energy for 10th graders.', slug: 'class-10/physics' },
  { id: '3', grade: 'Class XI', subject: 'Physics', title: 'Class XI | Physics', description: 'Advanced topics including mechanics, thermodynamics, and waves for 11th graders.', slug: 'class-11/physics' },
  { id: '4', grade: 'Class XII', subject: 'Physics', title: 'Class XII | Physics', description: 'In-depth study of electrostatics, optics, modern physics, and semiconductors for 12th graders.', slug: 'class-12/physics' },
];

const fallbackVideos: VideoResource[] = [
  { id: 'v1', title: 'Introduction to Kinematics', thumbnailUrl: 'https://placehold.co/320x180.png', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:20', description: 'Understanding motion, displacement, velocity, and acceleration.' },
];
const fallbackDocuments: DocumentResource[] = [
  { id: 'd1', title: 'Chapter 1 Notes - Units and Measurements.pdf', type: 'pdf', icon: 'FileText', downloadUrl: '#', uploadDate: '2024-05-10T10:00:00Z', fileSize: '1.2MB' },
];
const mockMaterialContents: Record<string, MaterialContent> = {
  'class-9/physics': { grade: 'Class IX', subject: 'Physics', title: 'Class IX Physics Resources', videos: fallbackVideos, documents: fallbackDocuments },
  'class-10/physics': { grade: 'Class X', subject: 'Physics', title: 'Class X Physics Resources', videos: fallbackVideos, documents: fallbackDocuments },
  'class-11/physics': { grade: 'Class XI', subject: 'Physics', title: 'Class XI Physics Resources', videos: fallbackVideos, documents: fallbackDocuments },
  'class-12/physics': { grade: 'Class XII', subject: 'Physics', title: 'Class XII Physics Resources', videos: fallbackVideos, documents: fallbackDocuments },
};
// --- End Mock Data ---


// --- Google Drive Integration (Conceptual Structure) ---

// IMPORTANT: The following sections outline a conceptual structure.
// Actual Google Drive integration requires:
// 1. Google Cloud Project setup with Drive API enabled.
// 2. Service Account credentials securely stored (e.g., environment variables).
// 3. Using the 'googleapis' library for Node.js.
// 4. Robust error handling, retry logic, and pagination for API calls.
// 5. A background polling mechanism (cron job) to update the cache/database.

const GDRIVE_FOLDER_MAPPINGS: Record<string, string> = {
  // Example: 'grade-slug/subject-slug': 'YOUR_GOOGLE_DRIVE_FOLDER_ID'
  'class-9/physics': 'DRIVE_FOLDER_ID_CLASS_9_PHYSICS',
  'class-10/physics': 'DRIVE_FOLDER_ID_CLASS_10_PHYSICS',
  'class-11/physics': 'DRIVE_FOLDER_ID_CLASS_11_PHYSICS',
  'class-12/physics': 'DRIVE_FOLDER_ID_CLASS_12_PHYSICS',
  // Add actual mappings here
};

const GDRIVE_VIDEO_XML_FILENAME = 'videos.xml';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string; // For viewing
  webContentLink?: string; // For direct download (often needs manipulation or specific API call)
  modifiedTime: string; // ISO Date string
  size?: string; // Size in bytes as a string
  // Other fields from Drive API as needed
}

async function listFilesInDriveFolder(folderId: string): Promise<DriveFile[]> {
  // TODO: Implement using Google Drive API (e.g., google.drive('v3').files.list)
  // This function would:
  // 1. Authenticate with Google Drive using service account credentials.
  // 2. List files in the given folderId, requesting fields like id, name, mimeType, webViewLink, webContentLink, modifiedTime, size.
  // 3. Handle pagination if there are many files.
  // 4. Implement retry logic for API call failures.
  console.warn(`[Google Drive STUB] Simulating listing files for folderId: ${folderId}. Implement actual API call.`);
  
  // Mock response based on current mock data for demonstration
  const mockFolderKey = Object.keys(GDRIVE_FOLDER_MAPPINGS).find(key => GDRIVE_FOLDER_MAPPINGS[key] === folderId);
  if (mockFolderKey && mockMaterialContents[mockFolderKey]) {
      const docs = mockMaterialContents[mockFolderKey].documents.map((doc, i) => ({
          id: `mock-drive-doc-${i}-${Date.now()}`,
          name: doc.title,
          mimeType: doc.type === 'pdf' ? 'application/pdf' : (doc.type === 'doc' || doc.type === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain'),
          webContentLink: `https://drive.google.com/uc?export=download&id=mock-drive-doc-${i}`, // Simulated
          webViewLink: `#mock-view-link-doc-${i}`,
          modifiedTime: doc.uploadDate,
          size: doc.fileSize ? (parseFloat(doc.fileSize) * 1024 * 1024).toString() : '0',
      }));
      // Add a mock videos.xml file to the list
      docs.push({
          id: `mock-drive-xml-${Date.now()}`,
          name: GDRIVE_VIDEO_XML_FILENAME,
          mimeType: 'application/xml',
          webContentLink: `#mock-xml-content-link`,
          webViewLink: `#mock-view-link-xml`,
          modifiedTime: new Date().toISOString(),
          size: '1024',
      });
      return docs as DriveFile[];
  }
  return [];
}

async function getFileContentFromDrive(fileId: string): Promise<string | null> {
  // TODO: Implement using Google Drive API (e.g., google.drive('v3').files.get with alt: 'media')
  // This function would:
  // 1. Authenticate.
  // 2. Download the content of the file.
  // 3. Implement retries.
  console.warn(`[Google Drive STUB] Simulating fetching content for fileId: ${fileId}. Implement actual API call.`);
   if (fileId.startsWith('mock-drive-xml')) { // Simulate fetching the XML content
    return `
      <videos>
        <video>
          <title>Gravity Explained (from Drive XML)</title>
          <description>A deep dive into gravitational forces, based on XML from Drive.</description>
          <embedUrl>https://www.youtube.com/embed/LAGISbGhN_w</embedUrl>
          <thumbnailUrl>https://placehold.co/320x180.png</thumbnailUrl>
          <duration>12:30</duration>
        </video>
        <video>
          <title>Optics Fundamentals (from Drive XML)</title>
          <description>Understanding light reflection and refraction, from an XML file in Drive.</description>
          <embedUrl>https://www.youtube.com/embed/K_xvy2hU00I</embedUrl>
          <thumbnailUrl>https://placehold.co/320x180.png</thumbnailUrl>
          <duration>18:15</duration>
        </video>
      </videos>
    `;
  }
  return null;
}

function parseVideosXml(xmlString: string, xmlFileModifiedTime: string): VideoResource[] {
  // TODO: Implement robust XML parsing (e.g., using a library like 'fast-xml-parser').
  // The current implementation is a very basic placeholder.
  console.warn('[XML STUB] Simulating XML parsing for videos. Implement robust parsing.');
  try {
    const videoMatches = [...xmlString.matchAll(/<video>([\s\S]*?)<\/video>/g)];
    return videoMatches.map((match, index) => {
      const content = match[1];
      const title = content.match(/<title>(.*?)<\/title>/)?.[1] || `Video ${index + 1}`;
      const description = content.match(/<description>(.*?)<\/description>/)?.[1];
      const embedUrl = content.match(/<embedUrl>(.*?)<\/embedUrl>/)?.[1] || 'https://www.youtube.com/embed/VIDEO_ID_MISSING';
      const thumbnailUrl = content.match(/<thumbnailUrl>(.*?)<\/thumbnailUrl>/)?.[1] || 'https://placehold.co/320x180.png';
      const duration = content.match(/<duration>(.*?)<\/duration>/)?.[1];
      return {
        id: `xml-v${index}-${new Date().getTime()}`, // Create a unique ID
        title,
        description,
        embedUrl,
        thumbnailUrl,
        duration,
        uploadDate: xmlFileModifiedTime, // Use XML file's modified time as upload date for all videos in it
      };
    });
  } catch (error) {
    console.error("Error parsing videos XML:", error);
    return [];
  }
}

// --- Cache (Conceptual In-Memory Cache for Demonstration) ---
interface CacheEntry {
  data: MaterialContent;
  timestamp: number; // When the cache entry was created
}
const materialCache = new Map<string, CacheEntry>();
const CACHE_STALE_DURATION_MS = 1 * 60 * 1000; // Data is considered stale after 1 minute (for demo)
const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // Max age to serve stale data if fetch fails (5 minutes for demo)

// --- Main Data Fetching Function ---
export async function getMaterialContent(gradeSlug: string, subjectSlug: string): Promise<MaterialContent | null> {
  const contentKey = `${gradeSlug}/${subjectSlug}`;
  const driveFolderId = GDRIVE_FOLDER_MAPPINGS[contentKey];

  const cachedEntry = materialCache.get(contentKey);

  // If cache is fresh, serve from cache
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_STALE_DURATION_MS)) {
    console.log(`[Cache] Serving FRESH content for ${contentKey}.`);
    return cachedEntry.data;
  }

  if (!driveFolderId) {
    console.warn(`No Google Drive folder mapping for ${contentKey}. Using fallback mock data.`);
    return mockMaterialContents[contentKey] || null;
  }

  try {
    console.log(`[Google Drive] Fetching content for ${contentKey} (Folder ID: ${driveFolderId}). Cache is stale or missing.`);
    const driveFiles = await listFilesInDriveFolder(driveFolderId); // This would have retry logic in a real implementation

    const documents: DocumentResource[] = [];
    let videos: VideoResource[] = [];
    let videoXmlFile: DriveFile | null = null;

    for (const file of driveFiles) {
      if (file.name === GDRIVE_VIDEO_XML_FILENAME && (file.mimeType === 'application/xml' || file.mimeType === 'text/xml')) {
        videoXmlFile = file;
        continue;
      }
      if (file.mimeType === 'application/vnd.google-apps.folder') continue; // Skip sub-folders

      const fileNameParts = file.name.split('.');
      const fileExtension = fileNameParts.length > 1 ? fileNameParts.pop()!.toLowerCase() : '';
      let icon: DocumentIconName = 'File';
      let type: DocumentType = 'file';

      if (['pdf'].includes(fileExtension)) { icon = 'FileText'; type = 'pdf'; }
      else if (['doc', 'docx'].includes(fileExtension)) { icon = 'FileArchive'; type = fileExtension as DocumentType; }
      else if (['txt'].includes(fileExtension)) { icon = 'FileText'; type = 'txt'; }
      
      // Construct a direct download link. The exact format can vary.
      // For files stored in Google Drive, webContentLink is often the one.
      // Or, using files.get with alt=media. For files shared publicly:
      // `https://drive.google.com/uc?export=download&id=${file.id}`
      const downloadUrl = file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`;


      documents.push({
        id: file.id,
        title: file.name,
        type: type,
        icon: icon,
        downloadUrl: downloadUrl,
        uploadDate: new Date(file.modifiedTime).toISOString(),
        fileSize: file.size ? `${(parseInt(file.size, 10) / (1024 * 1024)).toFixed(1)}MB` : undefined,
      });
    }

    if (videoXmlFile) {
      const xmlContent = await getFileContentFromDrive(videoXmlFile.id);
      if (xmlContent) {
        videos = parseVideosXml(xmlContent, new Date(videoXmlFile.modifiedTime).toISOString());
      } else {
        console.warn(`Could not fetch or parse ${GDRIVE_VIDEO_XML_FILENAME} (ID: ${videoXmlFile.id})`);
      }
    }

    documents.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    // Videos are sorted by their order in XML, or could be sorted by uploadDate (XML file's modifiedTime) if needed.

    const currentGradeData = mockMaterialContents[contentKey] || { grade: gradeSlug, subject: subjectSlug, title: `${gradeSlug} ${subjectSlug} Resources`};

    const fetchedContent: MaterialContent = {
      grade: currentGradeData.grade,
      subject: currentGradeData.subject,
      title: currentGradeData.title,
      videos: videos.length > 0 ? videos : (fallbackVideos || []), // Fallback to mock if XML processing fails
      documents: documents.length > 0 ? documents : (fallbackDocuments || []), // Fallback if no documents found
    };

    materialCache.set(contentKey, { data: fetchedContent, timestamp: Date.now() });
    console.log(`[Cache] Updated cache for ${contentKey} with fresh data from Drive.`);
    return fetchedContent;

  } catch (error) {
    console.error(`[Google Drive] Error fetching content for ${contentKey}:`, error);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_MAX_AGE_MS)) {
      console.warn(`[Cache] Serving STALE content for ${contentKey} due to fetch error.`);
      return cachedEntry.data; // Serve stale cache if not too old
    }
    console.warn(`[Fallback] Serving MOCK data for ${contentKey} due to fetch error and no suitable cache.`);
    return mockMaterialContents[contentKey] || null;
  }
}
// Note: Actual polling (every minute, retries, updating cache if file deleted) would be
// handled by a separate background process/cron job that calls a function similar to
// the fetching logic above, but designed to update a persistent cache or database.
// This `getMaterialContent` function would then primarily read from that cache.

export async function getTeacherProfile(): Promise<TeacherProfile> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockTeacherProfile;
}

export async function getResourceCategories(): Promise<ResourceCategory[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  // These categories could also be dynamically generated based on Drive folder structure in a more advanced setup.
  return mockResourceCategories;
}
