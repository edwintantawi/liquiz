import * as React from 'react';

import { CreateTopicButton } from '~/components/topic/create-topic-button';
import { TopicItem } from '~/components/topic/topic-item';
import { getAllTopics } from '~/lib/queries/topic';

export async function TopicList() {
  const topics = await getAllTopics();

  return (
    <ul className="grid gap-2">
      {topics.map((topic) => {
        return (
          <li key={topic.id}>
            <TopicItem
              id={topic.id}
              title={topic.title}
              subject={topic.subject}
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
