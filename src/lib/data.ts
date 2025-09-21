
import type { TeacherProfile, ResourceCategory, MaterialContent, DocumentIconName, DocumentType } from '@/types';
import { fetchDocumentsFromR2 } from "./utils";

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
    if (parts.length != 2) {
      console.warn(`Skipping resource with unexpected key format: ${resource.key}`);
      continue;
    }

    // if (resource.key == 'videos.xml') {
    //   console.warn('Skipping videos.xml file as it is not a resource category.');
    //   continue;
    // }

    const [gradesub, filename] = parts;
    const [, grade, subject] = gradesub.split('-');
    // Check if this category already exists in resourceCategories
    if (!resourceCategories.some(category => category.gradesub === gradesub)) {
      resourceCategories.push({
        gradesub: gradesub,
        title: `Class ${grade.toUpperCase()} | ${subject.toUpperCase()}`,
        description: `Study material for Class ${grade.toUpperCase()} - ${subject}.`,
        slug: `class-${grade}/${subject}`,
      });
    }

    if (!materialPerCategory.has(gradesub)) {
      materialPerCategory.set(gradesub, {
        title: `Class ${grade.toUpperCase()} ${subject.toUpperCase()} Resources`,
        description: `Explore videos and docs for Class ${grade.toUpperCase()} ${subject}.`,
        videos: [],
        documents: [],
      });
    }

    const materialContent = materialPerCategory.get(gradesub)!;
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
      uploadDate: new Date().toISOString(), // Use current time for mock
      fileSize: 'Unknown', // Size not available in this mock
    });

    // call read of the videos.xml file if it exists
    // then push video objects to the videos array
  }
  } catch (error) {
    console.error('Error populating resources from R2:', error);
    throw error; // Re-throw to be caught by initializationPromise
  }
}


// --- Main Data Fetching Function ---
export async function getMaterialContent(gradeSlug: string, subjectSlug: string): Promise<MaterialContent | null> {
  // Ensure initialization is complete before returning data
  await initializationPromise;
  const contentKey = `${gradeSlug}-${subjectSlug}`;
  return materialPerCategory.get(contentKey) || null;
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