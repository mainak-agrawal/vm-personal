import type { TeacherProfile, ResourceCategory, TopicCategory, MaterialContent, VideoResource, DocumentIconName, DocumentType } from '@/types';
import { fetchDocumentsFromR2, getYoutubeVideosFromR2File } from "./utils";

const R2_CUSTOM_DOMAIN = "https://vm-personal-website.r2.vishvamohan.com";

const teacherProfile: TeacherProfile = {
  name: 'Vishva Mohan',
  title: 'Coach, Mentor, Guide.',
  photoUrl: '/vishva_photo.jpg',
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

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

// Helper function to convert R2 URL to custom domain URL
function convertToCustomDomainUrl(r2Url: string): string {
  // Replace the R2 domain with the custom domain while keeping the path
  return r2Url.replace(/https:\/\/[^\/]+/, R2_CUSTOM_DOMAIN);
}

// Helper function to determine file icon and type based on extension
function getFileIconAndType(filename: string): { icon: DocumentIconName; type: DocumentType } {
  const fileExtension = filename.split('.').pop()?.toLowerCase() || '';
  let icon: DocumentIconName = 'File';
  let type: DocumentType = 'file';
  
  // PDF files
  if (['pdf'].includes(fileExtension)) { 
    icon = 'FileType'; 
    type = 'pdf'; 
  }
  // Word documents
  else if (['doc', 'docx'].includes(fileExtension)) { 
    icon = 'FileText'; 
    type = fileExtension as DocumentType; 
  }
  // Excel spreadsheets
  else if (['xls', 'xlsx'].includes(fileExtension)) { 
    icon = 'FileSpreadsheet'; 
    type = fileExtension as DocumentType; 
  }
  // PowerPoint presentations
  else if (['ppt', 'pptx'].includes(fileExtension)) { 
    icon = 'FileArchive'; 
    type = fileExtension as DocumentType; 
  }
  // Archive files
  else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension)) { 
    icon = 'FileArchive'; 
    type = fileExtension as DocumentType; 
  }
  // Image files
  else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension)) { 
    icon = 'FileImage'; 
    type = fileExtension as DocumentType; 
  }
  // Video files
  else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(fileExtension)) { 
    icon = 'FileVideo'; 
    type = fileExtension as DocumentType; 
  }
  // Audio files
  else if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(fileExtension)) { 
    icon = 'FileAudio'; 
    type = fileExtension as DocumentType; 
  }
  // Text files
  else if (['txt', 'md', 'rtf'].includes(fileExtension)) { 
    icon = 'FileText'; 
    type = fileExtension as DocumentType; 
  }
  // Default for unknown file types
  else {
    icon = 'File';
    type = 'file';
  }
  
  return { icon, type };
}

// Static data containers - these will be populated from JSON at runtime
let staticData: {
  resourceCategories: ResourceCategory[];
  topicCategories: Record<string, TopicCategory[]>;
  materialPerCategory: Record<string, MaterialContent>;
} | null = null;

// Build-time data population function (used by the build script)
export async function populateStaticData(): Promise<{
  resourceCategories: ResourceCategory[];
  topicCategories: Record<string, TopicCategory[]>;
  materialPerCategory: Record<string, MaterialContent>;
}> {
  console.log('[BUILD] Starting static data population...');
  
  try {
    // Add timeout wrapper for R2 calls
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('R2 data fetch timeout after 30 seconds')), 30000);
    });

    const resources = await Promise.race([
      fetchDocumentsFromR2(),
      timeoutPromise
    ]);

    if (resources.length === 0) {
      console.warn('[BUILD] No resources found in R2 bucket.');
      return {
        resourceCategories: [],
        topicCategories: {},
        materialPerCategory: {}
      };
    }

    const resourceCategories: ResourceCategory[] = [];
    const topicCategories = new Map<string, TopicCategory[]>();
    const materialPerCategory = new Map<string, MaterialContent>();

    console.log(`[BUILD] Found ${resources.length} resources in R2 bucket.`);
    
    for (const resource of resources) {
      const parts = resource.key.split('/');
      if (parts.length !== 3) {
        console.warn(`[BUILD] Skipping resource with unexpected key format: ${resource.key}`);
        continue;
      }

      const [gradesub, topicName, filename] = parts;
      const [, grade, subject] = gradesub.split('-');
      
      // Check if this category already exists in resourceCategories
      if (!resourceCategories.some(category => category.gradesub === gradesub)) {
        resourceCategories.push({
          gradesub: gradesub,
          title: `Class ${grade.toUpperCase()} | ${subject.replace(/_/g, ' ').toUpperCase()}`,
          description: `Study material for Class ${grade.toUpperCase()} - ${subject.replace(/_/g, ' ').toUpperCase()}.`,
          slug: gradesub,
        });
      }

      // Add topic to topicCategories if not exists
      if (!topicCategories.has(gradesub)) {
        topicCategories.set(gradesub, []);
      }
      
      const existingTopics = topicCategories.get(gradesub)!;
      if (!existingTopics.some(topic => topic.slug === topicName)) {
        const displayName = topicName.replace(/_/g, ' ');
        const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        existingTopics.push({
          id: `${gradesub}-${topicName}`,
          name: capitalizedName,
          description: `Study materials for ${capitalizedName} in Class ${grade.toUpperCase()} ${subject.replace(/_/g, ' ').toUpperCase()}`,
          slug: topicName,
          gradeSubject: gradesub,
        });
      }

      // Create material content key combining gradeSubject and topic
      const contentKey = `${gradesub}/${topicName}`;
      
      if (!materialPerCategory.has(contentKey)) {
        const displayName = topicName.replace(/_/g, ' ');
        const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        materialPerCategory.set(contentKey, {
          title: `${capitalizedName} - Class ${grade.toUpperCase()} ${subject.replace(/_/g, ' ').toUpperCase()}`,
          description: `Videos and documents for ${capitalizedName} in Class ${grade.toUpperCase()} ${subject.replace(/_/g, ' ').toUpperCase()}`,
          topic: topicName,
          gradeSubject: gradesub,
          videos: [],
          documents: [],
        });
      }

      const materialContent = materialPerCategory.get(contentKey)!;

      if (filename === "videos.txt") {
        // Populate the videos array based on the YouTube URLs in the file
        try {
          const videoTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('YouTube video fetch timeout')), 15000);
          });

          const videoMap = await Promise.race([
            getYoutubeVideosFromR2File(resource.key),
            videoTimeoutPromise
          ]);
          
          // Convert YouTube metadata to VideoResource objects
          let videoIndex = 0;
          for (const [youtubeUrl, metadata] of videoMap.entries()) {
            // Extract video ID from YouTube URL for embed
            const videoId = extractYouTubeVideoId(youtubeUrl);
            if (videoId) {
              materialContent.videos.push({
                id: `${contentKey}-video-${videoIndex}`,
                title: metadata.title.replace(/_/g, ' '),
                description: `By ${metadata.author_name}`,
                thumbnailUrl: metadata.thumbnail_url,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                duration: '',
                uploadDate: resource.uploaded.toISOString(),
              });
              videoIndex++;
            }
          }
          
          console.log(`[BUILD] Added ${videoIndex} videos for ${contentKey}`);
        } catch (error) {
          console.error(`[BUILD] Failed to process videos.txt for ${contentKey}:`, error);
        }
      } else {
        const { icon, type } = getFileIconAndType(filename);
        
        materialContent.documents.push({
          id: resource.key,
          title: filename,
          type: type,
          icon: icon,
          downloadUrl: convertToCustomDomainUrl(resource.url),
          uploadDate: resource.uploaded.toISOString(),
          fileSize: `${(resource.size / 1024).toFixed(2)} KB`,
        });
      }
    }

    console.log(`[BUILD] Static data population completed - ${resourceCategories.length} categories, ${topicCategories.size} topic groups, ${materialPerCategory.size} material items`);

    // Convert Maps to plain objects for serialization
    const topicCategoriesObj: Record<string, TopicCategory[]> = {};
    for (const [key, value] of topicCategories.entries()) {
      topicCategoriesObj[key] = value;
    }

    const materialPerCategoryObj: Record<string, MaterialContent> = {};
    for (const [key, value] of materialPerCategory.entries()) {
      materialPerCategoryObj[key] = value;
    }

    return {
      resourceCategories,
      topicCategories: topicCategoriesObj,
      materialPerCategory: materialPerCategoryObj
    };
  } catch (error) {
    console.error('[BUILD] Error populating static data:', error);
    throw error;
  }
}

// Function to load static data from JSON (used at runtime)
function loadStaticData() {
  if (staticData) return staticData;
  
  try {
    // Try to load the static data JSON file
    staticData = require('./static-data.json');
    console.log('[RUNTIME] Loaded static data from JSON file');
    return staticData!;
  } catch (error) {
    console.warn('[RUNTIME] Static data JSON not found, using empty data:', error);
    staticData = {
      resourceCategories: [],
      topicCategories: {},
      materialPerCategory: {}
    };
    return staticData;
  }
}

// Runtime data access functions (these use the pre-built static data)
export async function getTeacherProfile(): Promise<TeacherProfile> {
  return teacherProfile;
}

export async function getResourceCategories(): Promise<ResourceCategory[]> {
  const data = loadStaticData();
  return data.resourceCategories;
}

export async function getTopicsForGradeSubject(gradeSlug: string): Promise<TopicCategory[]> {
  const data = loadStaticData();
  return data.topicCategories[gradeSlug] || [];
}

export async function getMaterialContent(gradeSlug: string, topicSlug: string): Promise<MaterialContent | null> {
  const data = loadStaticData();
  const contentKey = `${gradeSlug}/${topicSlug}`;
  return data.materialPerCategory[contentKey] || null;
}
