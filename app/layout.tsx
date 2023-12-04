import Link from 'next/link';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

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
      <body className="flex h-full flex-col">
        <nav className="sticky top-0 z-50 bg-background">
          <Container className="flex items-center justify-between gap-2 border-b">
            <Button asChild size="icon" className="shrink-0">
              <Link href="/">
                <Icons.Brand className="text-background" />
                <span className="sr-only">LiQuiz</span>
              </Link>
            </Button>

            <SearchBar />

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
              </DropdownMenuContent>
            </DropdownMenu>
          </Container>
        </nav>
        <main className="flex-1">
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}
