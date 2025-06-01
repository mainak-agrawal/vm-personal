import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function MaterialNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
      <h1 className="font-headline text-4xl font-bold text-destructive mb-4">Materials Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Sorry, we couldn&apos;t find the resources you were looking for.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/resources">Back to Resources</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
