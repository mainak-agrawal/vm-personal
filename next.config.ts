import type {NextConfig} from 'next';

const posthogAssetHost =
  process.env.NEXT_PUBLIC_POSTHOG_ASSET_HOST ?? 'https://us-assets.i.posthog.com';
const posthogApiHost =
  process.env.NEXT_PUBLIC_POSTHOG_API_HOST ?? 'https://us.i.posthog.com';

const nextConfig: NextConfig = {
  /* config options here */
  // Required so PostHog reverse-proxy rewrites are not affected by trailing-slash handling.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: `${posthogAssetHost}/static/:path*`,
      },
      {
        source: '/ingest/:path*',
        destination: `${posthogApiHost}/:path*`,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vishvamohan.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
