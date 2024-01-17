'use client';

import * as React from 'react';

import { HistoryStatus } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { HistorySummary } from '~/lib/types/history';

interface HistorySummaryProps {
  historyId: string;
  summary: HistorySummary;
}

export function HistorySummary({ historyId, summary }: HistorySummaryProps) {
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
    <article>
      <h2>Summary</h2>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </article>
  );
}
