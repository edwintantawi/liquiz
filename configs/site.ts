import { env } from '~/lib/env.mjs';

export const siteConfig = {
  url: new URL(env.BASE_URL),
  manifest: '/manifest.json',
  title: 'LiQuiz',
  headline: 'AI-Powered Practice Question Generator',
  description:
    'Turn your study materials into a dynamic and interactive learning experience with our AI-powered question generator.',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/favicon.ico', sizes: '16x16' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};
