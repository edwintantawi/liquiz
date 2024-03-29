import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ErrorBoundary } from 'react-error-boundary';

import { Container } from '~/components/container';
import { DetailHeader } from '~/components/detail-header';
import { HistoryChart } from '~/components/history/history-chart';
import { HistoryListSkeleton } from '~/components/history/history-list-skeleton';
import { HistoryTopicList } from '~/components/history/history-topic-list';
import { Icons } from '~/components/icons';
import { Section } from '~/components/section';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { getHistoriesChartByTopicId } from '~/lib/queries/history';
import { getTopicById } from '~/lib/queries/topic';

export const metadata = {
  title: 'Topic Histories',
};

interface TopicHistoriesPageProps {
  params: { topic_id: string };
}

export default async function TopicHistoriesPage({
  params,
}: TopicHistoriesPageProps) {
  const topic = await getTopicById(params.topic_id);
  const histories = await getHistoriesChartByTopicId(params.topic_id);

  if (topic === null) notFound();

  return (
    <Container className="p-0">
      <DetailHeader
        title={topic.title}
        subtitle={topic.subject.title}
        color={topic.subject.color}
        startAdornment={
          <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
            {topic.numberOfHistories}{' '}
            {topic.numberOfHistories <= 1 ? 'History' : 'Histories'}
          </span>
        }
      >
        <Button asChild size="icon" variant="outline" className="shrink-0">
          <Link href={`/subjects/${topic.subject.id}`}>
            <Icons.Back size={20} />
            <span className="sr-only">View ${topic.subject.title} subject</span>
          </Link>
        </Button>
        <Button asChild className="w-full border border-white">
          <Link href={`/topics/${params.topic_id}`}>
            <Icons.Retake size={20} className="shrink-0" />
            <span>
              {topic.numberOfHistories >= 1
                ? 'Retake the topic'
                : 'Take the topic'}
            </span>
          </Link>
        </Button>
      </DetailHeader>

      <div className="p-3">
        <HistoryChart
          histories={histories}
          color={topic.subject.color}
          numberOfQuestions={topic.numberOfQuestions}
        />

        <Section
          title={`Histories (${topic.numberOfHistories})`}
          description="List of topic histories"
        >
          <ErrorBoundary
            fallback={
              <Alert variant="destructive">
                <Icons.Error size={20} />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                  Failed to request your {topic.title} topic histories
                </AlertDescription>
              </Alert>
            }
          >
            <React.Suspense fallback={<HistoryListSkeleton count={8} />}>
              <HistoryTopicList topicId={params.topic_id} />
            </React.Suspense>
          </ErrorBoundary>
        </Section>
      </div>
    </Container>
  );
}
