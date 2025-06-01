import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ResourceCategory } from '@/types';
import { ArrowRight } from 'lucide-react';

interface ResourceCategoryCardProps {
  category: ResourceCategory;
}

export function ResourceCategoryCard({ category }: ResourceCategoryCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{category.title}</CardTitle>
        <CardDescription className="text-muted-foreground pt-1 min-h-[3rem]">{category.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
          <Link href={`/resources/${category.slug}`}>
            View Materials
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
