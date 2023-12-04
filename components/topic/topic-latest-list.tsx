import * as React from 'react';

import { TopicItem } from '~/components/topic';
import { getLatestTopics } from '~/lib/queries/topics';

export async function TopicLatestList() {
  const latestTopics = await getLatestTopics({ limit: 5 });

  return (
    <ul className="space-y-2">
      {latestTopics.map((topic) => {
        return (
          <li key={topic.id}>
            <TopicItem
              id={topic.id}
              title={topic.title}
              score={topic.score}
              subject={{
                id: topic.subject.id,
                title: topic.subject.title,
                colorCode: topic.subject.colorCode,
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
