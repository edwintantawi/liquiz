/* eslint-disable tailwindcss/migration-from-tailwind-2 */
'use client';

import * as React from 'react';

import { HistoryStatus } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { HistorySummary } from '~/lib/types/history';
import { cn, tailwindCssColorToHex } from '~/lib/utils';

import { Icons } from '../icons';
import { Skeleton } from '../ui/skeleton';

interface HistorySummaryProps {
  historyId: string;
  summary: HistorySummary;
  color: string;
}

export function HistorySummary({
  historyId,
  summary,
  color,
}: HistorySummaryProps) {
  const [isSummaryBeingGenerated, setIsSummaryBeingGenerated] =
    React.useState<boolean>(summary.status === HistoryStatus.PENDING);

  const { data } = useQuery({
    queryKey: ['histories', historyId],
    queryFn: async () => {
      const response = await fetch(
        `/api/fetcher/histories/${historyId}/summary`
      );
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const newSummary = (await response.json()) as HistorySummary;
      setIsSummaryBeingGenerated(newSummary.status === HistoryStatus.PENDING);
      return newSummary;
    },
    enabled: isSummaryBeingGenerated,
    initialData: summary,
    refetchInterval: 10_000,
  });

  return (
    <article
      className={cn(
        'relative rounded-md border bg-opacity-5 px-4 py-3 pb-5',
        color
      )}
      style={{ borderColor: tailwindCssColorToHex(color) }}
    >
      <h2 className="flex items-center gap-1 text-lg font-semibold">
        <Icons.AI size={20} stroke={tailwindCssColorToHex(color)} /> Summary
      </h2>
      <section className="mt-2">
        <h3 className="sr-only">Feedback</h3>
        <div className="space-y-3 text-sm">
          {data.feedbacks.map((feedback, index) => (
            <p key={index} className="text-muted-foreground">
              {feedback}
            </p>
          ))}

          {isSummaryBeingGenerated && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Skeleton className={cn('h-6 w-full bg-opacity-10', color)} />
                <Skeleton className={cn('h-6 w-2/3 bg-opacity-10', color)} />
              </div>
              <div className="space-y-1">
                <Skeleton className={cn('h-6 w-4/5 bg-opacity-10', color)} />
                <Skeleton className={cn('h-6 w-full bg-opacity-10', color)} />
              </div>
              <div className="space-y-1">
                <Skeleton className={cn('h-6 w-full bg-opacity-10', color)} />
                <Skeleton className={cn('h-6 w-1/2 bg-opacity-10', color)} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-4">
        <h3 className="mb-2 flex items-center gap-1 text-lg font-semibold">
          <Icons.Suggestion size={20} stroke={tailwindCssColorToHex(color)} />{' '}
          Suggestions
        </h3>
        <ul className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          {data.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>

        {isSummaryBeingGenerated && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Skeleton className={cn('h-6 w-full bg-opacity-10', color)} />
              <Skeleton className={cn('h-6 w-full bg-opacity-10', color)} />
            </div>
            <div className="space-y-1">
              <Skeleton className={cn('h-6 w-4/5 bg-opacity-10', color)} />
              <Skeleton className={cn('h-6 w-2/3 bg-opacity-10', color)} />
            </div>
            <div className="space-y-1">
              <Skeleton className={cn('h-6 w-full bg-opacity-10', color)} />
              <Skeleton className={cn('h-6 w-3/4 bg-opacity-10', color)} />
              <Skeleton className={cn('h-6 w-5/6 bg-opacity-10', color)} />
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
