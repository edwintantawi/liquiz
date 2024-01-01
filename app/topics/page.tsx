import * as React from 'react';
import Link from 'next/link';

import { ErrorBoundary } from 'react-error-boundary';

import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { Icons } from '~/components/icons';
import { TopicList } from '~/components/topic/topic-list';
import { TopicListSkeleton } from '~/components/topic/topic-list-skeleton';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';

export default function TopicsPage() {
  return (
    <Container>
      <Header title="Topics" description="Collection of existing topics">
        <Button asChild size="icon" className="h-12 w-12">
          <Link href="/topics/new">
            <Icons.Plus />
            <span className="sr-only">Create new topic</span>
          </Link>
        </Button>
      </Header>

      <ErrorBoundary
        fallback={
          <Alert variant="destructive">
            <Icons.Error size={20} />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>Failed to request your topics</AlertDescription>
          </Alert>
        }
      >
        <React.Suspense fallback={<TopicListSkeleton count={11} />}>
          <TopicList />
        </React.Suspense>
      </ErrorBoundary>
    </Container>
  );
}
