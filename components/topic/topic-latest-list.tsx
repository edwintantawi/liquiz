import * as React from 'react';

import { CreateTopicButton } from '~/components/topic/create-topic-button';
import { TopicItem } from '~/components/topic/topic-item';
import { getLatestTopics } from '~/lib/queries/topic';

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
              subject={{
                id: topic.subject.id,
                title: topic.subject.title,
                color: topic.subject.color,
              }}
            />
          </li>
        );
      })}
      <li>
        <CreateTopicButton />
      </li>
    </ul>
  );
}
