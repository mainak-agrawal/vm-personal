import type { TeacherProfile, ResourceCategory, TopicCategory, MaterialContent, VideoResource, DocumentIconName, DocumentType } from '@/types';
import { fetchDocumentsFromR2, getYoutubeVideosFromR2File, getObjectTitleFromR2 } from "./utils";

const R2_CUSTOM_DOMAIN = "https://vm-personal-website.r2.vishvamohan.com";

const teacherProfile: TeacherProfile = {
  name: 'Vishva Mohan',
  title: 'Coach, Mentor, Guide.',
  photoUrl: '/vishva_photo_webp.webp',
  bio: 'With over two decades of experience in teaching Physics and Science, I have dedicated my career to helping students discover the joy of learning and the power of analytical thinking. As a coach and mentor, I have had the privilege of guiding hundreds of students to achieve excellence in some of the most competitive academic arenas. Many of my students have secured admissions to India\'s top institutions such as the IITs, NITs, and leading government and private medical colleges, as well as reputed schools and universities abroad in the United States, Germany, and Australia.\n\nMy journey into full-time education began after taking early retirement from the civil service, as District Magistrate and Special Commissioner — widely regarded as one of the most prestigious careers in India. This decision was driven by a deep passion for learning and an even greater desire to share that learning with young, curious minds. I believe that true education goes beyond textbooks; it involves nurturing integrity, curiosity, and perseverance.\n\nEthics form the foundation of my approach to both teaching and life. I believe that knowledge, when combined with honesty and purpose, has the power to transform individuals and societies. Over the years, I have seen my students grow not only as scholars but also as responsible, value-driven individuals who contribute meaningfully to their fields. Many of them are now thriving in multinational companies, entrepreneurial ventures, and public service across India and world.\n\nAs an educator, my mission continues to be - inspiring students to think critically, question deeply, and learn passionately. I take great pride in being part of their journey toward excellence and in watching them shape a better, more thoughtful world.',
  academicProfiles: [
    {
      degree: 'Academic Credentials',
      points: [
        'B.Tech, IIT Delhi (1988) — All India JEE Rank: 201 | CGPA: 7.87/10.00',
        'MBA, University of Notre Dame, USA (2005) — GMAT: 760/800 | TOEFL: 283/300 | GPA: 3.91/4.00',
        'UPSC Civil Services Exam (1991) — All India Rank: 479 | Optionals: Physics & Mechanical Engineering',
      ],
    },
  ],
  professionalSections: [
    {
      heading: 'Career',
      description: '<b>As a coach</b>',
      points: [
        'Teaching and mentoring for excellence, success in competitive exams',
        'Specialization: JEE (Advanced/Main), NEET Physics, Science and Math for class 8 onward, SAT, SoP advice for college admissions',
      ],
    },
    {
      description: '<b>As an administrator</b> (mostly in Delhi Government and Andaman and Nicobar administration)',
      points: [
        'Core governance: Sub Divisional Magistrate, Additional District Magistrate, District Magistrate, Jail Superintendent, Additional Chief Electoral Officer',
        'Departmental functions: Joint Commissioner (Transport), Deputy Secretary (Power), Additional Commissioner (Industries), Additional Registrar (Cooperative Societies), Joint Secretary (Agriculture)',
        'Public Sector/Developmental: General Manager - ANIIDCO, General Manager – DSIIDC, Commissioner – DDA, OSD – Delhi Transport Corporation, Competent Authority – National Monuments Authority',
        'Cultural/Social/Educational: Additional Secretary (Art and Culture), Additional Chief Executive (Mission Convergence), Secretary (SPCA), Secretary (Sahitya Kala Parishad), Centre Coordinator – IGNOU and NOS, Chairman – Kendriya Vidyalaya, Vigyan Vihar; Chairman – Joint Assessment Committee, IP University',
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
    
    // Set of all object keys, used to resolve quiz preview images without extra requests.
    const allKeys = new Set(resources.map((r) => r.key));

    for (const resource of resources) {
      const parts = resource.key.split('/');
      // Root files use `gradesub/topic/filename` (3 parts).
      // Interactive lessons and quizzes live in subdirectories:
      // `gradesub/topic/sims/file.html` and `gradesub/topic/quiz/file.html` (4 parts).
      if (parts.length < 3 || parts.length > 4) {
        console.warn(`[BUILD] Skipping resource with unexpected key format: ${resource.key}`);
        continue;
      }

      const gradesub = parts[0];
      const topicName = parts[1];
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
          interactiveLessons: [],
          quizzes: [],
          documents: [],
        });
      }

      const materialContent = materialPerCategory.get(contentKey)!;

      // Handle subdirectory files: interactive lessons (/sims) and quizzes (/quiz).
      if (parts.length === 4) {
        const subdir = parts[2];
        const filename = parts[3];
        const fileExtension = filename.split('.').pop()?.toLowerCase() || '';

        // Only HTML files are served/listed. Image files (jpg/png) in /quiz exist
        // solely for social-media preview (og) tags, so they are ignored here.
        if (fileExtension !== 'html' && fileExtension !== 'htm') {
          continue;
        }

        if (subdir !== 'sims' && subdir !== 'quiz') {
          console.warn(`[BUILD] Skipping unknown subdirectory in key: ${resource.key}`);
          continue;
        }

        // The display name comes from the object's "title" metadata; fall back to filename.
        let title = '';
        try {
          title = await getObjectTitleFromR2(resource.key);
        } catch (error) {
          console.error(`[BUILD] Failed to read title metadata for ${resource.key}:`, error);
        }
        if (!title) {
          title = filename.replace(/\.html?$/i, '').replace(/_/g, ' ');
        }

        const htmlResource = {
          id: resource.key,
          title,
          url: convertToCustomDomainUrl(resource.url),
          uploadDate: resource.uploaded.toISOString(),
        };

        if (subdir === 'sims') {
          materialContent.interactiveLessons.push(htmlResource);
        } else {
          // Quizzes may have a social-preview image sharing the html's path/name
          // with a .jpg (preferred) or .png extension. It's optional.
          const baseKey = resource.key.replace(/\.html?$/i, '');
          const previewKey = [`${baseKey}.jpg`, `${baseKey}.png`].find((k) => allKeys.has(k));
          const previewImageUrl = previewKey ? `${R2_CUSTOM_DOMAIN}/${previewKey}` : undefined;
          materialContent.quizzes.push({ ...htmlResource, previewImageUrl });
        }

        continue;
      }

      const filename = parts[2];

      // Skip R2 "folder" placeholder objects (0-byte keys ending in '/').
      if (filename === "") {
        continue;
      }

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
