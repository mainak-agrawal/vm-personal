// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { populateStaticData } = require('../src/lib/data.ts');
const { writeFileSync, mkdirSync } = require('fs');
const { join, dirname } = require('path');

async function generateStaticData() {
  console.log('[BUILD] Generating static data for build...');
  
  // Check if required environment variables are available
  if (!process.env.R2_ACCESS_KEY || !process.env.R2_SECRET_KEY) {
    console.error('[BUILD] Missing required environment variables: R2_ACCESS_KEY, R2_SECRET_KEY');
    console.log('[BUILD] These should be available in .env.local file');
    process.exit(1);
  }
  
  try {
    const staticData = await populateStaticData();
    
    // Ensure the directory exists
    const outputPath = join(process.cwd(), 'src/lib/static-data.json');
    mkdirSync(dirname(outputPath), { recursive: true });
    
    // Write the data to a JSON file that can be imported at build time
    writeFileSync(outputPath, JSON.stringify(staticData, null, 2));
    
    console.log(`[BUILD] Static data written to ${outputPath}`);
    console.log(`[BUILD] - ${staticData.resourceCategories.length} resource categories`);
    console.log(`[BUILD] - ${Object.keys(staticData.topicCategories).length} topic groups`);
    console.log(`[BUILD] - ${Object.keys(staticData.materialPerCategory).length} material items`);
    
    // Generate static params for dynamic routes
    const staticParams = {
      gradeParams: staticData.resourceCategories.map((cat: any) => ({ grade: cat.gradesub })),
      topicParams: [] as Array<{ grade: string; subject: string }>
    };
    
    // Generate all grade/topic combinations
    for (const [gradeSlug, topics] of Object.entries(staticData.topicCategories)) {
      for (const topic of (topics as any[])) {
        staticParams.topicParams.push({
          grade: gradeSlug,
          subject: topic.slug
        });
      }
    }
    
    const paramsPath = join(process.cwd(), 'src/lib/static-params.json');
    writeFileSync(paramsPath, JSON.stringify(staticParams, null, 2));
    
    console.log(`[BUILD] Static params written to ${paramsPath}`);
    console.log(`[BUILD] - ${staticParams.gradeParams.length} grade routes`);
    console.log(`[BUILD] - ${staticParams.topicParams.length} topic routes`);
    
  } catch (error) {
    console.error('[BUILD] Failed to generate static data:', error);
    process.exit(1);
  }
}

generateStaticData();
