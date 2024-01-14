import { CreateTopicButton } from '~/components/topic/create-topic-button';
import { TopicItem } from '~/components/topic/topic-item';
import { TopicListEmpty } from '~/components/topic/topic-list-empty';
import { getLatestTopics } from '~/lib/queries/topic';

export async function TopicLatestList() {
  const latestTopics = await getLatestTopics({ limit: 5 });

  const isEmpty = latestTopics.length === 0;

  return (
    <ul className="space-y-2">
      {isEmpty && (
        <li>
          <TopicListEmpty />
        </li>
      )}

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
