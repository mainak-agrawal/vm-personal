
import type { TeacherProfile, ResourceCategory, TopicCategory, MaterialContent, VideoResource, DocumentIconName, DocumentType } from '@/types';
import { fetchDocumentsFromR2, getYoutubeVideosFromR2File } from "./utils";

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

let materialPerCategory = new Map<string, MaterialContent>();
let resourceCategories = new Array<ResourceCategory>();
let topicCategories = new Map<string, TopicCategory[]>(); // Map from gradeSubject to topics

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

// Initialization state tracking
let isInitializing = false;
let isInitialized = false;
let initializationError: Error | null = null;

let initializationPromise: Promise<void> | null = null;

// Function to get or create the initialization promise
function getInitializationPromise(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = populateAvailableResources();
  }
  return initializationPromise;
}

async function populateAvailableResources(): Promise<void> {
  if (isInitialized) {
    console.log('[DEBUG] Data already initialized, skipping...');
    return;
  }

  // If currently initializing, wait for it to complete
  if (isInitializing) {
    console.log('[DEBUG] Initialization already in progress, waiting...');
    // Wait for the current initialization to complete
    while (isInitializing && !isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return;
  }

  isInitializing = true;
  console.log('[DEBUG] Starting data initialization...');

  try {
    // Add timeout wrapper for R2 calls
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('R2 data fetch timeout after 30 seconds')), 30000);
    });

    const resources = await Promise.race([
      fetchDocumentsFromR2(),
      timeoutPromise
    ]);

    if (resources.length == 0) {
      console.warn('No resources found in R2 bucket.');
      isInitialized = true; // Mark as initialized even with empty data
      return;
    }

    // Clear existing data to ensure clean state
    resourceCategories.length = 0;
    topicCategories.clear();
    materialPerCategory.clear();

    console.log(`Found ${resources.length} resources in R2 bucket.`);
    for (const resource of resources) {
      const parts = resource.key.split('/');
      if (parts.length != 3) {
        console.warn(`Skipping resource with unexpected key format: ${resource.key}`);
        continue;
      }

      const [gradesub, topicName, filename] = parts;
      const [, grade, subject] = gradesub.split('-');
      
      // Check if this category already exists in resourceCategories
      if (!resourceCategories.some(category => category.gradesub === gradesub)) {
        resourceCategories.push({
          gradesub: gradesub,
          title: `Class ${grade.toUpperCase()} | ${subject.toUpperCase()}`,
          description: `Study material for Class ${grade.toUpperCase()} - ${subject.toUpperCase()}.`,
          slug: gradesub,
        });
      }

      // Add topic to topicCategories if not exists
      if (!topicCategories.has(gradesub)) {
        topicCategories.set(gradesub, []);
      }
      
      const existingTopics = topicCategories.get(gradesub)!;
      if (!existingTopics.some(topic => topic.slug === topicName)) {
        const displayName = topicName.replace(/_/g, ' ').charAt(0).toUpperCase() + topicName.replace(/_/g, ' ').slice(1);
        existingTopics.push({
          id: `${gradesub}-${topicName}`,
          name: displayName, // Capitalize first letter and replace underscores
          description: `Study materials for ${displayName} in Class ${grade.toUpperCase()} ${subject.toUpperCase()}`,
          slug: topicName,
          gradeSubject: gradesub,
        });
      }

      // Create material content key combining gradeSubject and topic
      const contentKey = `${gradesub}/${topicName}`;
      
      if (!materialPerCategory.has(contentKey)) {
        const displayName = topicName.replace(/_/g, ' ').charAt(0).toUpperCase() + topicName.replace(/_/g, ' ').slice(1);
        materialPerCategory.set(contentKey, {
          title: `${displayName} - Class ${grade.toUpperCase()} ${subject.toUpperCase()}`,
          description: `Videos and documents for ${displayName} in Class ${grade.toUpperCase()} ${subject.toUpperCase()}`,
          topic: topicName,
          gradeSubject: gradesub,
          videos: [],
          documents: [],
        });
      }

      const materialContent = materialPerCategory.get(contentKey)!;

      if (filename == "videos.txt")
      {
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
                duration: '', // Duration not available from oEmbed API
                uploadDate: resource.uploaded.toISOString(),
              });
              videoIndex++;
            }
          }
          
          console.log(`Added ${videoIndex} videos for ${contentKey}`);
        } catch (error) {
          console.error(`Failed to process videos.txt for ${contentKey}:`, error);
          // Continue processing other files even if video processing fails
        }
      }
      else
      {
        const fileExtension = filename.split('.').pop()?.toLowerCase() || '';
        let icon: DocumentIconName = 'File';
        let type: DocumentType = 'file';
        if (['pdf'].includes(fileExtension)) { icon = 'FileText'; type = 'pdf'; }
        else if (['doc', 'docx'].includes(fileExtension)) { icon = 'FileArchive'; type = fileExtension as DocumentType; }
        else if (['txt'].includes(fileExtension)) { icon = 'FileText'; type = 'txt'; }
        materialContent.documents.push({
          id: resource.key,
          title: filename,
          type: type,
          icon: icon,
          downloadUrl: resource.url,
          uploadDate: resource.uploaded.toISOString(),
          fileSize: `${(resource.size / 1024).toFixed(2)} KB`,
        });
      }
    }

    isInitialized = true;
    console.log('[DEBUG] Data initialization completed successfully');
  } catch (error) {
    console.error('Error populating resources from R2:', error);
    initializationError = error as Error;
    // Don't throw - let the app continue with empty data
  } finally {
    isInitializing = false;
  }
}

// Start initialization immediately when module loads
getInitializationPromise().catch((error) => {
  console.error('Failed to initialize R2 data:', error);
  initializationError = error;
});

export async function ensureDataInitialized(): Promise<void> {
  // Always wait for the single initialization promise
  await getInitializationPromise();
  
  // If initialization failed with an error, show warning
  if (initializationError) {
    console.warn('[DEBUG] Data initialization failed:', initializationError.message);
  }
}

// --- Main Data Fetching Functions ---
export async function getMaterialContent(gradeSlug: string, topicSlug: string): Promise<MaterialContent | null> {
  try {
    // Ensure initialization is complete before returning data
    await ensureDataInitialized();
    const contentKey = `${gradeSlug}/${topicSlug}`;
    return materialPerCategory.get(contentKey) || null;
  } catch (error) {
    console.error('Error in getMaterialContent:', error);
    return null;
  }
}

export async function getTopicsForGradeSubject(gradeSlug: string): Promise<TopicCategory[]> {
  try {
    // Ensure initialization is complete before returning data
    await ensureDataInitialized();
    return topicCategories.get(gradeSlug) || [];
  } catch (error) {
    console.error('Error in getTopicsForGradeSubject:', error);
    return [];
  }
}

export async function getTeacherProfile(): Promise<TeacherProfile> {
  // Teacher profile doesn't depend on R2 data, but keeping async for consistency
  return teacherProfile;
}

export async function getResourceCategories(): Promise<ResourceCategory[]> {
  try {
    // Ensure initialization is complete before returning data
    await ensureDataInitialized();
    return resourceCategories;
  } catch (error) {
    console.error('Error in getResourceCategories:', error);
    return [];
  }
}