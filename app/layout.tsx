import Link from 'next/link';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

import '~/app/style.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable, 'h-full')}
    >
      <body className="mx-auto flex h-full max-w-md flex-col">
        <div className="border-b p-3">
          <Button asChild size="icon">
            <Link href="/">
              <Icons.Brand className="text-white" />
              <span className="sr-only">LiQuiz</span>
            </Link>
          </Button>
        </div>
        {children}
      </body>
    </html>
  );
}
