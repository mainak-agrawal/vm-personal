import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTeacherProfile } from '@/lib/data';
import type { TeacherProfile } from '@/types';
import { ArrowRight, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function HomePage() {
  const profile: TeacherProfile = await getTeacherProfile();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:shrink-0 md:w-1/3">
            <Image
              src={profile.photoUrl}
              alt={profile.name}
              width={400}
              height={400}
              className="h-full w-full object-cover"
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

              <div>
                <h3 className="font-headline text-xl font-semibold text-foreground mb-3">Credentials</h3>
                <ul className="space-y-2">
                  {profile.credentials.map((cred, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span>{cred}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-headline text-xl font-semibold text-foreground mb-3">Experience</h3>
                <ul className="space-y-2">
                  {profile.experience.map((exp, index) => (
                    <li key={index} className="flex items-start text-muted-foreground">
                       <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1 shrink-0" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/resources">
                    Explore Resources
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
