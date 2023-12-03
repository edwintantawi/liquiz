import Link from 'next/link';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { Icons } from '~/components/icons';
import { SearchBar } from '~/components/search-bar';
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
      className={cn(GeistSans.variable, GeistMono.variable, 'dark h-full')}
    >
      <body className="mx-auto flex h-full max-w-md flex-col">
        <div className="flex gap-2 border-b p-3">
          <Button asChild size="icon" className="shrink-0">
            <Link href="/">
              <Icons.Brand className="text-background" />
              <span className="sr-only">LiQuiz</span>
            </Link>
          </Button>

          <SearchBar />
        </div>
        {children}
      </body>
    </html>
  );
}
