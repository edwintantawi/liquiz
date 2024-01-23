import * as React from 'react';
import Link from 'next/link';

import { SignInButton, SignOutButton } from '~/components/auth';
import { Icons } from '~/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { auth } from '~/lib/auth';
import { getInitialName } from '~/lib/utils';

export async function Menu() {
  const { isAuthenticated, user } = await auth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Icons.Menu size={20} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 p-0 lg:w-96">
        <SheetHeader className="p-4">
          <div className="flex justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Icons.Menu size={18} />
              LiQuiz Menu
            </SheetTitle>
            <SheetCloseButton />
          </div>
        </SheetHeader>
        <div className="flex h-[calc(100dvh-60px)] flex-col justify-between px-4 pb-4">
          <nav className="space-y-4">
            {isAuthenticated && (
              <div className="grid grid-cols-[auto,1fr] items-center gap-2 rounded-md border-2 px-3 py-2">
                <Avatar className="border">
                  <AvatarImage src={user.image ?? ''} alt="" />
                  <AvatarFallback>
                    {getInitialName(user.name ?? '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-sm font-semibold">{user?.name}</h2>
                  <span className="rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            )}

            <ul className="space-y-2">
              <li>
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:ring-2 hover:ring-ring hover:ring-offset-2"
                  >
                    <Icons.Dashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                </SheetClose>
              </li>
              <li>
                <SheetClose asChild>
                  <Link
                    href="/subjects"
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:ring-2 hover:ring-ring hover:ring-offset-2"
                  >
                    <Icons.Subject size={16} />
                    <span>Subjects</span>
                  </Link>
                </SheetClose>
              </li>
              <li>
                <SheetClose asChild>
                  <Link
                    href="/subjects/new"
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:ring-2 hover:ring-ring hover:ring-offset-2"
                  >
                    <Icons.AddSubject size={16} />
                    <span>Create Subject</span>
                  </Link>
                </SheetClose>
              </li>
              <li>
                <SheetClose asChild>
                  <Link
                    href="/topics"
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:ring-2 hover:ring-ring hover:ring-offset-2"
                  >
                    <Icons.Topic size={16} />
                    <span>Topics</span>
                  </Link>
                </SheetClose>
              </li>
              <li>
                <SheetClose asChild>
                  <Link
                    href="/topics/new"
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:ring-2 hover:ring-ring hover:ring-offset-2"
                  >
                    <Icons.AddTopic size={16} />
                    <span>Create Topic</span>
                  </Link>
                </SheetClose>
              </li>
            </ul>
          </nav>

          {isAuthenticated ? (
            <SignOutButton className="w-full">
              <Icons.SignOut size={16} />
              <span>Sign out</span>
            </SignOutButton>
          ) : (
            <SignInButton className="w-full">
              <Icons.SignIn size={16} />
              <span>Sign in</span>
            </SignInButton>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
