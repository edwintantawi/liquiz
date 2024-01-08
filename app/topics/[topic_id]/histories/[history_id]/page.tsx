import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '~/components/container';
import { DetailHeader } from '~/components/detail-header';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { getHistoryById } from '~/lib/queries/history';

interface HistoryDetailPageProps {
  params: { topic_id: string; history_id: string };
}

export default async function HistoryDetailPage({
  params,
}: HistoryDetailPageProps) {
  const history = await getHistoryById({
    topicId: params.topic_id,
    historyId: params.history_id,
  });

  if (history === null) notFound();

  return (
    <Container className="p-0">
      <DetailHeader
        title={history.topic.title}
        subtitle={history.topic.subject.title}
        color={history.topic.subject.color}
        startAdornment={
          <div className="flex gap-1">
            <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
              {history.topic.numberOfQuestions}{' '}
              {history.topic.numberOfQuestions <= 1 ? 'Question' : 'Questions'}
            </span>
            <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
              {history.score}%
            </span>
          </div>
        }
      >
        <Button asChild size="icon" variant="outline" className="shrink-0">
          <Link href={`/topics/${history.topic.id}/histories`}>
            <Icons.Back size={20} />
            <span className="sr-only">
              Back to {history.topic.title} topic histories
            </span>
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href={`/topics/${history.topic.id}`}>
            <Icons.Retake size={20} className="shrink-0" />
            <span>Retake</span>
          </Link>
        </Button>
      </DetailHeader>

      <p className="p-8 text-center">Score: {history.score}%</p>
    </Container>
  );
}
