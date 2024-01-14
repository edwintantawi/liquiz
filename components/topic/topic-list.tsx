import { CreateTopicButton } from '~/components/topic/create-topic-button';
import { TopicItem } from '~/components/topic/topic-item';
import { TopicListEmpty } from '~/components/topic/topic-list-empty';
import { getAllTopics } from '~/lib/queries/topic';

export async function TopicList() {
  const topics = await getAllTopics();

  const isEmpty = topics.length === 0;

  return (
    <ul className="grid gap-2">
      {isEmpty && (
        <li>
          <TopicListEmpty />
        </li>
      )}

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
