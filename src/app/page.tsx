
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeacherProfile } from '@/lib/data';
import type { TeacherProfile, AcademicProfile, ProfessionalProfileSection } from '@/types';
import { ArrowRight, Dot } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Home',
};

const SubBulletPoint = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start text-muted-foreground ml-6">
    <Dot className="h-5 w-5 text-primary mr-2 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);


export default async function HomePage() {
  const profile: TeacherProfile = await getTeacherProfile();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:shrink-0 md:w-2/5">
            <Image
              src={profile.photoUrl}
              alt={profile.name}
              width={482} 
              height={587} 
              className="h-full w-full object-contain" // Changed from object-cover to object-contain
              data-ai-hint="teacher portrait"
              priority
            />
          </div>
          <div className="p-6 md:p-8 flex-1">
            <CardHeader className="p-0 mb-4">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{profile.name}</h1>
              <p className="text-xl text-accent font-semibold mt-1">{profile.title}</p>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-2">About Me</h2>
                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
              </div>

              {profile.academicProfiles.map((academic, index) => (
                <div key={`academic-${index}`}>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1 flex items-center">
                    <Dot className="h-6 w-6 text-primary mr-1 shrink-0" />
                    {academic.degree}
                  </h3>
                  <ul className="space-y-1">
                    {academic.points.map((point, pIndex) => (
                      <SubBulletPoint key={`academic-${index}-point-${pIndex}`}>{point}</SubBulletPoint>
                    ))}
                  </ul>
                </div>
              ))}
              
              {profile.professionalSections.map((section, index) => (
                <div key={`professional-${index}`}>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1 flex items-center">
                    <Dot className="h-6 w-6 text-primary mr-1 shrink-0" />
                    {section.heading}
                  </h3>
                  <ul className="space-y-1">
                    {section.points.map((point, pIndex) => (
                      <SubBulletPoint key={`professional-${index}-point-${pIndex}`}>{point}</SubBulletPoint>
                    ))}
                  </ul>
                </div>
              ))}
              
              <div className="pt-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/resources">
                    Resources
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
