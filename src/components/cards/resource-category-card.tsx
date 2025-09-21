import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ResourceCategory } from '@/types';
import { ArrowRight } from 'lucide-react';

interface ResourceCategoryCardProps {
  category: ResourceCategory;
}

export function ResourceCategoryCard({ category }: ResourceCategoryCardProps) {
  return (
    <Link href={`/resources/${category.slug}`} className="block h-full">
      <Card className="flex flex-col h-full hover:shadow-lg hover:bg-primary/5 active:shadow-sm active:scale-[0.98] active:translate-y-0.5 transition-all duration-200 cursor-pointer group">
        <CardHeader className="flex-1">
          <CardTitle className="font-headline text-2xl text-primary group-hover:text-primary/80 transition-colors">
            {category.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1 min-h-[3rem]">
            {category.description}
          </CardDescription>
          <div className="flex items-center text-primary pt-2 group-hover:translate-x-1 transition-transform">
            <span className="text-sm font-medium">View Materials</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
