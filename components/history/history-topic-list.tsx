import * as React from 'react';

import { HistoryItem } from '~/components/history/history-item';
import { Icons } from '~/components/icons';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { getHistoriesByTopicId } from '~/lib/queries/history';

interface HistoryTopicListProps {
  topicId: string;
}

export async function HistoryTopicList({ topicId }: HistoryTopicListProps) {
  const histories = await getHistoriesByTopicId(topicId);

  const isEmpty = histories.length === 0;

  return (
    <ul className="grid gap-2">
      {histories.map((history) => {
        return (
          <li key={history.id}>
            <HistoryItem
              id={history.id}
              createdAt={history.createdAt}
              score={history.score}
              topicId={topicId}
            />
          </li>
        );
      })}

      {isEmpty && (
        <li>
          <Alert>
            <Icons.History size={20} />
            <AlertTitle>No history found</AlertTitle>
            <AlertDescription>
              There is no history of work on this topic, let&apos;s start
              answering questions about this topic{' '}
            </AlertDescription>
          </Alert>
        </li>
      )}
    </ul>
  );
}
