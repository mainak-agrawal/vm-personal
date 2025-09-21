import Link from 'next/link';
// Option 1: Use Next.js Link as a button instead
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
        <Link 
          href="/resources" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to Resources
        </Link>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
