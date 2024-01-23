import * as React from 'react';
import Link from 'next/link';

import { ErrorBoundary } from 'react-error-boundary';

import { Container } from '~/components/container';
import { Icons } from '~/components/icons';
import { Section } from '~/components/section';
import {
  SubjectCount,
  SubjectCountSkeleton,
} from '~/components/subject/subject-count';
import { SubjectLatestList } from '~/components/subject/subject-latest-list';
import { SubjectListSkeleton } from '~/components/subject/subject-list-skeleton';
import { TopicCount, TopicCountSkeleton } from '~/components/topic/topic-count';
import { TopicLatestList } from '~/components/topic/topic-latest-list';
import { TopicListSkeleton } from '~/components/topic/topic-list-skeleton';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { auth } from '~/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session.isAuthenticated) return null;

  return (
    <Container>
      <div className="space-y-6">
        <div className="space-y-2">
          <header className="rounded-md border bg-gradient-to-tr from-slate-50/50 to-slate-100">
            <div className="flex flex-col justify-center px-4 py-6 sm:p-8">
              <h1 className="text-sm font-semibold text-muted-foreground">
                Welcome to LiQuiz ✨ ,
              </h1>
              <p className="text-xl font-bold">{session.user.name}</p>
              <p className="text-sm text-muted-foreground">
                what do you want to start practicing today?
              </p>
            </div>
          </header>

          <div className="space-y-2">
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

        <Section
          title="Latest Topics"
          description="Explore the latest topics you created"
          endAdornment={
            <Button asChild variant="outline" size="icon">
              <Link href="/topics">
                <Icons.ChevronRight size={20} />
                <span className="sr-only">View all topics</span>
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
                  Failed to request your latest topics
                </AlertDescription>
              </Alert>
            }
          >
            <React.Suspense fallback={<TopicListSkeleton count={6} />}>
              <TopicLatestList />
            </React.Suspense>
          </ErrorBoundary>
        </Section>
      </div>
    </Container>
  );
}
