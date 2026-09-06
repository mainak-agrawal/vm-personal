'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-headline text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          Vishva Mohan
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
          </div>
          <SheetContent
            side="right"
            className="w-72 border-l border-border/60 bg-background/95 backdrop-blur-xl"
          >
            <SheetTitle className="font-headline text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Menu
            </SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation links
            </SheetDescription>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex items-center justify-between rounded-2xl px-4 py-3 font-headline text-2xl font-medium tracking-tight transition-colors',
                    isActive(link.href)
                      ? 'bg-secondary text-primary'
                      : 'text-foreground hover:bg-secondary/70'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full bg-primary transition-opacity',
                      isActive(link.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                    )}
                  />
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
