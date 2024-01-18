import * as React from 'react';
import Link from 'next/link';

import { ErrorBoundary } from 'react-error-boundary';

import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { Icons } from '~/components/icons';
import { SubjectList } from '~/components/subject/subject-list';
import { SubjectListSkeleton } from '~/components/subject/subject-list-skeleton';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';

export const metadata = {
  title: 'Subjects',
};

export default function SubjectsPage() {
  return (
    <Container>
      <Header title="Subjects" description="Collection of existing subjects">
        <Button asChild size="icon" className="size-12">
          <Link href="/subjects/new">
            <Icons.Plus />
            <span className="sr-only">Create new subject</span>
          </Link>
        </Button>
      </Header>

      <ErrorBoundary
        fallback={
          <Alert variant="destructive">
            <Icons.Error size={20} />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>Failed to request your subjects</AlertDescription>
          </Alert>
        }
      >
        <React.Suspense fallback={<SubjectListSkeleton count={8} />}>
          <SubjectList />
        </React.Suspense>
      </ErrorBoundary>
    </Container>
  );
}
