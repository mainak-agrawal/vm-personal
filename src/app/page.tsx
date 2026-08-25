
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeacherProfile } from '@/lib/data';
import type { TeacherProfile, AcademicProfile, ProfessionalProfileSection } from '@/types';
import { ArrowRight, Dot } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Vishva Mohan is a Physics educator and mentor coaching high school students for JEE and NEET. Explore free study materials, lecture videos, quizzes, and interactive simulations for JEE, NEET, CBSE, ICSE, and IB.',
};

const SubBulletPoint = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start text-muted-foreground ml-6">
    <Dot className="h-5 w-5 text-primary mr-2 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);

// Helper function to render text with HTML bold tags
const renderTextWithBold = (text: string) => {
  const parts = text.split(/(<b>.*?<\/b>)/g);
  return parts.map((part, index) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      const boldText = part.slice(3, -4); // Remove <b> and </b>
      return <strong key={index}>{boldText}</strong>;
    }
    return part;
  });
};


export default async function HomePage() {
  const profile: TeacherProfile = await getTeacherProfile();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="overflow-hidden shadow-xl">
        <div className="p-6 md:p-8">
          <CardHeader className="p-0 mb-6">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{profile.name}</h1>
            <p className="text-xl text-accent font-semibold mt-1">{profile.title}</p>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="relative">
              <Image
                src={profile.photoUrl}
                alt={profile.name}
                width={300} 
                height={365} 
                className="float-left mr-6 mb-4 rounded-lg shadow-md max-w-[250px] md:max-w-[300px] h-auto"
                data-ai-hint="teacher portrait"
                priority
              />
              <div>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">About Me</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4 text-justify">
                  {profile.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="clear-left"></div>
            </div>

              {profile.academicProfiles.map((academic, index) => (
                <div key={`academic-${index}`}>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">
                    {academic.degree}
                  </h3>
                  {academic.description && (
                    <p className="text-muted-foreground ml-6 font-medium mb-2">
                      {academic.description}
                    </p>
                  )}
                  <ul className="space-y-1">
                    {academic.points.map((point, pIndex) => (
                      <SubBulletPoint key={`academic-${index}-point-${pIndex}`}>{point}</SubBulletPoint>
                    ))}
                  </ul>
                </div>
              ))}
              
              {profile.professionalSections.map((section, index) => (
                <div key={`professional-${index}`}>
                  {section.heading ? (
                    <h3 className="font-headline text-lg font-semibold text-foreground mb-3">
                      {section.heading}
                    </h3>
                  ) : (
                    <div className="h-4"></div>
                  )}
                  {section.description && (
                    <p className="text-muted-foreground ml-6 text-base font-medium mb-4">
                      {renderTextWithBold(section.description)}
                    </p>
                  )}
                  <ul className="space-y-1">
                    {section.points.map((point, pIndex) => (
                      <SubBulletPoint key={`professional-${index}-point-${pIndex}`}>{point}</SubBulletPoint>
                    ))}
                  </ul>
                </div>
              ))}
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/resources">
                    Resources
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
        </div>
      </Card>
    </div>
  );
}
