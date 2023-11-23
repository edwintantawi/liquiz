import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { cn } from '~/lib/utils';

import '~/app/style.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <body>{children}</body>
    </html>
  );
}
