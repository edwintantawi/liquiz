import * as React from 'react';
import Link from 'next/link';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { Providers } from '~/app/providers';
import { Container } from '~/components/container';
import { Icons } from '~/components/icons';
import { Menu } from '~/components/menu';
import { Notification } from '~/components/notification';
import { SearchBar } from '~/components/search-bar';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { siteConfig } from '~/configs/site';
import { auth } from '~/lib/auth';
import { cn } from '~/lib/utils';

import '~/app/style.css';

export const metadata = {
  metadataBase: siteConfig.url,
  manifest: siteConfig.manifest,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.title,
    title: `${siteConfig.title} | ${siteConfig.headline}`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  description: siteConfig.description,
  icons: siteConfig.icons,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const { isAuthenticated } = await auth();

  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable, 'h-full')}
    >
      <body className="flex h-full flex-col">
        <Providers>
          <a href="#main" className="sr-only">
            Skip to main content
          </a>

          <nav className="sticky top-0 z-50 bg-background">
            <Container className="flex items-center justify-between gap-2 border-b">
              <div className="flex items-center gap-2">
                <Button asChild size="icon" className="shrink-0">
                  <Link href="/dashboard">
                    <Icons.Brand className="text-background" />
                    <span className="sr-only">LiQuiz</span>
                  </Link>
                </Button>

                {!isAuthenticated && (
                  <span className="text-xl font-bold">LiQuiz</span>
                )}
              </div>

              {isAuthenticated && (
                <>
                  <React.Suspense
                    fallback={<Skeleton className="h-10 w-full" />}
                  >
                    <SearchBar />
                  </React.Suspense>
                  <Notification />
                </>
              )}

              <Menu />
            </Container>
          </nav>

          <main id="main" className="flex-1">
            {children}
          </main>

          <footer className="mt-8">
            <Container className="flex items-center justify-between border-t">
              <p className="text-xs text-muted-foreground">
                Copyright © 2023 LiQuiz
              </p>
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="border"
              >
                <Link href="#">
                  <Icons.BackToTop size={20} />
                  <span className="sr-only">Back to top</span>
                </Link>
              </Button>
            </Container>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
