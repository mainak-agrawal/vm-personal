import Link from 'next/link';
import { BookOpenText } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-semibold text-primary hover:opacity-80 transition-opacity">
            <BookOpenText className="h-7 w-7 text-accent" />
            TeachSite
          </Link>
          <nav className="flex space-x-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/resources" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Resources
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
