import Link from 'next/link';
import { notFound } from 'next/navigation';

import { HistoryStatus } from '@prisma/client';

import { Container } from '~/components/container';
import { DetailHeader } from '~/components/detail-header';
import { HistorySummary } from '~/components/history/history-summary';
import { Icons } from '~/components/icons';
import { Question } from '~/components/question';
import { Button } from '~/components/ui/button';
import { getHistoryById } from '~/lib/queries/history';
import { cn } from '~/lib/utils';

export const metadata = {
  title: 'Topic History',
};

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

  const hasSummary = history.summary.status !== HistoryStatus.NONE;

  return (
    <Container className="p-0">
      <DetailHeader
        title={history.topic.title}
        subtitle={history.topic.subject.title}
        color={history.topic.subject.color}
        startAdornment={
          <div className="flex gap-1">
            <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
              <span className="font-semibold">{history.score}</span> of{' '}
              <span className="font-semibold">{history.numberOfQuestions}</span>{' '}
              questions correct
            </span>
            <span
              className={cn(
                'rounded-full border border-white bg-muted px-3 py-0.5 text-[0.60rem] font-semibold text-white',
                {
                  'bg-green-500': history.scoreInPercentage >= 75,
                  'bg-yellow-500':
                    history.scoreInPercentage >= 50 &&
                    history.scoreInPercentage < 75,
                  'bg-red-500': history.scoreInPercentage < 50,
                }
              )}
            >
              {history.scoreInPercentage}%
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
        <Button asChild className="w-full border border-white">
          <Link href={`/topics/${history.topic.id}`}>
            <Icons.Retake size={20} className="shrink-0" />
            <span>Retake</span>
          </Link>
        </Button>
      </DetailHeader>

      <div className="px-3 py-4">
        <ul className="mb-6 ml-5 list-decimal space-y-8">
          {history.questions.map((question) => (
            <li key={question.id} className="space-y-3">
              <Question statement={question.statement}>
                {question.options.map((option) => {
                  const checked = option.id === question.choice.optionId;
                  return (
                    <Question.Option
                      required
                      readOnly
                      key={option.id}
                      name={`question.${question.id}`}
                      value={option.id}
                      checked={checked}
                      disabled={!checked}
                      description={option.description}
                      isCorrect={question.isCorrect}
                    >
                      {option.statement}
                    </Question.Option>
                  );
                })}
              </Question>
            </li>
          ))}
        </ul>

        {hasSummary && (
          <HistorySummary
            historyId={history.id}
            summary={history.summary}
            color={history.topic.subject.color}
          />
        )}

        <div className="mt-12 flex items-center justify-between gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/topics/${history.topic.id}/histories`}>
              <Icons.History size={20} className="shrink-0" />
              <span>Histories</span>
            </Link>
          </Button>

          <Button asChild className="w-full">
            <Link href={`/topics/${history.topic.id}`}>
              <Icons.Retake size={20} className="shrink-0" />
              <span>Retake</span>
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
