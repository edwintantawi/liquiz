import * as React from 'react';
import Link from 'next/link';

import { ErrorBoundary } from 'react-error-boundary';

import { Icons } from '~/components/icons';
import { Section } from '~/components/section';
import {
  SubjectCount,
  SubjectCountSkeleton,
  SubjectLatestList,
  SubjectListSkeleton,
} from '~/components/subject';
import { TopicCount, TopicCountSkeleton } from '~/components/topic';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard',
  description: 'Manage all your subjects and topics easily',
};

export default async function RootPage() {
  return (
    <>
      <h1 className="sr-only">LiQuiz Dashboard</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="grid grid-cols-[auto,1fr] items-center gap-3 rounded-md border px-4 py-3">
            <Avatar>
              <AvatarImage src="" alt="" />
              <AvatarFallback>LQ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">LiQuiz User</h2>
              <span className="rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
                user@liquiz.com
              </span>
            </div>
          </div>

          <ErrorBoundary
            fallback={
              <Alert variant="destructive">
                <Icons.Error size={20} />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                  Failed to request your subjects and topics count
                </AlertDescription>
              </Alert>
            }
          >
            <div className="grid grid-cols-2 gap-2">
              <React.Suspense fallback={<SubjectCountSkeleton />}>
                <SubjectCount />
              </React.Suspense>

              <React.Suspense fallback={<TopicCountSkeleton />}>
                <TopicCount />
              </React.Suspense>
            </div>
          </ErrorBoundary>
        </div>

        <Section
          title="Latest Subjects"
          description="Explore the latest subjects you created"
          endAdornment={
            <Button asChild variant="outline" size="icon">
              <Link href="/subjects">
                <Icons.ChevronRight size={20} />
                <span className="sr-only">View all subjects</span>
              </Link>
            </Button>
          }
        >
          <ErrorBoundary
            fallback={
              <Alert variant="destructive">
                <Icons.Error size={20} />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                  Failed to request your latest subjects
                </AlertDescription>
              </Alert>
            }
          >
            <React.Suspense fallback={<SubjectListSkeleton count={6} />}>
              <SubjectLatestList />
            </React.Suspense>
          </ErrorBoundary>
        </Section>
      </div>
    </>
  );
}
