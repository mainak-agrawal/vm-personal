import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Science Classes by Vishva Mohan | Physics Coach for JEE & NEET',
    short_name: 'Vishva Mohan',
    description:
      'Physics educator and mentor coaching high school students for JEE and NEET. Free study materials, lecture videos, quizzes, and interactive simulations for CBSE, ICSE, and IB.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F0F4F8',
    theme_color: '#4361EE',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  };
}
