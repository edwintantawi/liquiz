import * as React from 'react';
import Link from 'next/link';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { SignInButton } from '~/components/auth/signin-button';
import { SignOutButton } from '~/components/auth/signout-button';
import { Container } from '~/components/container';
import { Icons } from '~/components/icons';
import { SearchBar } from '~/components/search-bar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Skeleton } from '~/components/ui/skeleton';
import { auth } from '~/lib/auth';
import { env } from '~/lib/env.mjs';
import { cn } from '~/lib/utils';

import '~/app/style.css';

export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  manifest: '/manifest.json',
  title: {
    default: 'LiQuiz',
    template: '%s - LiQuiz',
  },
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
              <React.Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <SearchBar />
              </React.Suspense>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Icons.Menu size={20} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>LiQuiz Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/subjects">
                      <Icons.Subject className="mr-2 h-4 w-4" />
                      <span>Subject</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/topics">
                      <Icons.Topic className="mr-2 h-4 w-4" />
                      <span>Topic</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">
                      <Icons.Favorite className="mr-2 h-4 w-4" />
                      <span>Favorite</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    {isAuthenticated ? (
                      <SignOutButton className="w-full">Sign Out</SignOutButton>
                    ) : (
                      <SignInButton className="w-full">Sign In</SignInButton>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Button asChild size="icon" variant="secondary" className="border">
              <Link href="#">
                <Icons.BackToTop size={20} />
                <span className="sr-only">Back to top</span>
              </Link>
            </Button>
          </Container>
        </footer>
      </body>
    </html>
  );
}
