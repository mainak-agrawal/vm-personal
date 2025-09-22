import { getResourceCategories } from '@/lib/data';
import type { ResourceCategory } from '@/types';
import { ResourceCategoryCard } from '@/components/cards/resource-category-card';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resources',
};

export default async function ResourcesPage() {
  const categories: ResourceCategory[] = await getResourceCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Teaching Resources</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find study materials, lecture videos, and documents organized by class and subject.
        </p>
      </header>
      
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <ResourceCategoryCard key={category.slug} category={category} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No resource categories available at the moment.</p>
      )}
    </div>
  );
}
