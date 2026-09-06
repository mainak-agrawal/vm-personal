import { Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Vishva Mohan Sir for coaching and mentoring inquiries.',
};

export default function ContactPage() {
  return (
    <div className="bg-aurora min-h-[calc(100dvh-4rem)]">
      <div className="container mx-auto max-w-3xl px-6 py-14 md:py-20">
        <header className="mb-10 text-center">
          <p className="font-headline text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Say hello
          </p>
          <h1 className="mt-3 font-headline text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Contact
          </h1>
        </header>

        <div className="space-y-5">
          <div className="flex items-center gap-4 rounded-3xl border border-border/50 bg-card p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-headline text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">Email</h2>
              <a
                href="mailto:vishva.mohan@gmail.com"
                className="text-lg font-medium text-primary transition-colors hover:text-primary/80"
              >
                vishva.mohan@gmail.com
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-border/50 bg-[hsl(var(--tile-3))] p-7">
            <h2 className="font-headline text-lg font-semibold tracking-tight text-foreground">Get in touch for</h2>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 text-muted-foreground sm:grid-cols-2">
              <li>JEE (Advanced/Main) Physics preparation</li>
              <li>NEET Physics coaching</li>
              <li>Doubt clearing for JEE/NEET Physics</li>
              <li>Science and Math for grades 8+</li>
              <li>SAT preparation*</li>
              <li>Statement of Purpose (SoP) guidance*</li>
              <li>College admission counseling*</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground/70">* Currently not offered</p>
          </div>

          <div className="rounded-3xl border border-border/50 bg-[hsl(var(--tile-1))] p-7">
            <h2 className="font-headline text-lg font-semibold tracking-tight text-foreground">Physics doubts</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              If you are facing difficulty with a specific problem/concept during your JEE/NEET preparation, Email me the problem. I will send you a paper/video solution, or offer you a (FREE) Zoom Session to discuss and solve the problem and associated concepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}