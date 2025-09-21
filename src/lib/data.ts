
import type { TeacherProfile, ResourceCategory, TopicCategory, MaterialContent, VideoResource, DocumentIconName, DocumentType } from '@/types';
import { fetchDocumentsFromR2, getYoutubeVideosFromR2File } from "./utils";

const teacherProfile: TeacherProfile = {
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

// Initialize data when the module is loaded with error handling
const initializationPromise = populateAvailableResources().catch((error) => {
  console.error('Failed to initialize R2 data:', error);
  // Don't throw here - let the app continue with empty data
  return Promise.resolve();
});

async function populateAvailableResources(): Promise<void> {
  try {
    const resources = await fetchDocumentsFromR2();
    if (resources.length == 0) {
      console.warn('No resources found in R2 bucket.');
      return;
    }

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
          const videoMap = await getYoutubeVideosFromR2File(resource.key);
          
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
  } catch (error) {
    console.error('Error populating resources from R2:', error);
    throw error; // Re-throw to be caught by initializationPromise
  }
}


// --- Main Data Fetching Functions ---
export async function getMaterialContent(gradeSlug: string, topicSlug: string): Promise<MaterialContent | null> {
  // Ensure initialization is complete before returning data
  await initializationPromise;
  const contentKey = `${gradeSlug}/${topicSlug}`;
  return materialPerCategory.get(contentKey) || null;
}

export async function getTopicsForGradeSubject(gradeSlug: string): Promise<TopicCategory[]> {
  // Ensure initialization is complete before returning data
  await initializationPromise;
  return topicCategories.get(gradeSlug) || [];
}

export async function getTeacherProfile(): Promise<TeacherProfile> {
  // Teacher profile doesn't depend on R2 data, but keeping async for consistency
  return teacherProfile;
}

export async function getResourceCategories(): Promise<ResourceCategory[]> {
  // Ensure initialization is complete before returning data
  await initializationPromise;
  return resourceCategories;
}