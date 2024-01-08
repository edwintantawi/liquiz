import * as React from 'react';

import { HistoryItem } from '~/components/history/history-item';
import { getHistoriesByTopicId } from '~/lib/queries/history';

interface HistoryTopicListProps {
  topicId: string;
}

export async function HistoryTopicList({ topicId }: HistoryTopicListProps) {
  const histories = await getHistoriesByTopicId(topicId);

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
    </ul>
  );
}
