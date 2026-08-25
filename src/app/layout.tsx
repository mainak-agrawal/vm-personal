import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from "@/components/ui/toaster";
import { AnalyticsProvider } from '@/components/analytics/analytics-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://vishvamohan.com'),
  title: {
    default: 'Vishva Mohan | Physics Educator for JEE & NEET',
    template: '%s | Vishva Mohan',
  },
  description:
    'Vishva Mohan is a Physics educator and mentor who coaches high school students for JEE and NEET. Explore free study materials, lecture videos, and practice resources across Physics, Mathematics, and Biology for CBSE, ICSE, and IB boards.',
  keywords: [
    'Vishva Mohan',
    'Physics teacher',
    'JEE Physics',
    'NEET Physics',
    'JEE coaching',
    'NEET coaching',
    'high school mentor',
    'Physics study material',
    'lecture videos',
    'Class XI Physics',
    'Class XII Physics',
    'Class X CBSE',
    'Class IX CBSE',
    'Biology',
    'Mathematics',
    'IB board',
    'ICSE board',
    'CBSE board',
  ],
  authors: [{ name: 'Vishva Mohan' }],
  creator: 'Vishva Mohan',
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vishvamohan.com',
    siteName: 'Vishva Mohan',
    title: 'Vishva Mohan | Physics Educator for JEE & NEET',
    description:
      'Physics educator and mentor coaching high school students for JEE and NEET. Free study materials, lecture videos, and practice resources like Quizzes and interactive simulations for JEE, NEET, CBSE, ICSE, and IB.',
    images: [{ url: '/vishva_photo.jpg', width: 1200, height: 630, alt: 'Vishva Mohan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vishva Mohan | Physics Educator for JEE & NEET',
    description:
      'Physics educator coaching high school students for JEE/NEET. Find free study materials, lecture videos, and practice resources like Quizzes and interactive simulations for JEE, NEET, CBSE, ICSE, and IB.',
    images: ['/vishva_photo.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Removed Inter font link, will use Playfair Display and PT Sans */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AnalyticsProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
