import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ErrorBoundary } from 'react-error-boundary';

import { Container } from '~/components/container';
import { DetailHeader } from '~/components/detail-header';
import { Icons } from '~/components/icons';
import { RetrievalTime } from '~/components/retrieval-time';
import { Section } from '~/components/section';
import { SubjectDeleteButton } from '~/components/subject/subject-delete-button';
import { TopicListSkeleton } from '~/components/topic/topic-list-skeleton';
import { TopicSubjectList } from '~/components/topic/topic-subject-list';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { getSubjectById } from '~/lib/queries/subject';

export const metadata = {
  title: 'Subject Detail',
};

interface SubjectDetailPageProps {
  params: { subject_id: string };
}

export default async function SubjectDetailPage({
  params,
}: SubjectDetailPageProps) {
  const subject = await getSubjectById(params.subject_id);

  if (subject === null) notFound();

  return (
    <Container className="p-0">
      <DetailHeader
        title={subject.title}
        subtitle={subject.description || '<no description>'}
        color={subject.color}
        startAdornment={
          <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
            {subject.numberOfTopics}{' '}
            {subject.numberOfTopics <= 1 ? 'Topic' : 'Topics'}
          </span>
        }
      >
        <Button asChild size="icon" variant="outline" className="shrink-0">
          <Link href="/subjects">
            <Icons.Subject size={20} />
            <span className="sr-only">View all subjects</span>
          </Link>
        </Button>
        <Button
          asChild
          className="grid w-full grid-cols-[1fr,auto] justify-between border border-white"
        >
          <a href={subject.fileUrl} target="_blank">
            <div className="flex items-center gap-2 truncate">
              <Icons.File size={20} className="shrink-0" />
              <span className="truncate">Document file</span>
            </div>
            <Icons.ExternalLink size={20} className="shrink-0" />
          </a>
        </Button>

        <Button asChild size="icon" variant="outline" className="shrink-0">
          <Link href={`/subjects/${subject.id}/edit`}>
            <Icons.Edit size={20} />
            <span className="sr-only">Edit subject</span>
          </Link>
        </Button>

        <SubjectDeleteButton subjectId={subject.id} />
      </DetailHeader>

      <RetrievalTime targetId={subject.id} />

      <div className="p-3">
        <Section
          title={`Topics (${subject.numberOfTopics})`}
          description="List of topics that you have created"
          endAdornment={
            <Button asChild variant="outline" size="icon">
              <Link
                href={{
                  pathname: '/topics/new',
                  search: `subject_id=${subject.id}`,
                }}
              >
                <Icons.Plus size={20} />
                <span className="sr-only">Add new topic</span>
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
                  Failed to request your {subject.title} subject topics
                </AlertDescription>
              </Alert>
            }
          >
            <React.Suspense fallback={<TopicListSkeleton count={8} />}>
              <TopicSubjectList subjectId={params.subject_id} />
            </React.Suspense>
          </ErrorBoundary>
        </Section>
      </div>
    </Container>
  );
}
