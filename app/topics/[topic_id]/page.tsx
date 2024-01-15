import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TopicDetailProviders } from '~/app/topics/[topic_id]/providers';
import { Container } from '~/components/container';
import { DetailHeader } from '~/components/detail-header';
import { Icons } from '~/components/icons';
import { TopicQuestionForm } from '~/components/topic/topic-question-form';
import { Button } from '~/components/ui/button';
import { getQuestionsByTopicId } from '~/lib/queries/question';
import { getTopicById } from '~/lib/queries/topic';

interface TopicDetailPageProps {
  params: { topic_id: string };
}

export default async function TopicDetailPage({
  params,
}: TopicDetailPageProps) {
  const topic = await getTopicById(params.topic_id);
  const questions = await getQuestionsByTopicId(params.topic_id);

  if (topic === null) notFound();

  return (
    <Container className="p-0">
      <DetailHeader
        title={topic.title}
        subtitle={topic.subject.title}
        color={topic.subject.color}
        startAdornment={
          <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
            {topic.numberOfQuestions}{' '}
            {topic.numberOfQuestions <= 1 ? 'Question' : 'Questions'}
          </span>
        }
      >
        <Button asChild size="icon" variant="outline" className="shrink-0">
          <Link href={`/subjects/${topic.subject.id}`}>
            <Icons.Back size={20} />
            <span className="sr-only">
              Back to {topic.subject.title} subject
            </span>
          </Link>
        </Button>
        <Button asChild className="w-full border border-white">
          <Link href={`/topics/${topic.id}/histories`}>
            <Icons.History size={20} className="shrink-0" />
            <span>Histories</span>
          </Link>
        </Button>
      </DetailHeader>

      <TopicDetailProviders>
        <TopicQuestionForm
          topicId={topic.id}
          subjectId={topic.subject.id}
          totalQuestions={topic.numberOfQuestions}
          questions={questions}
        />
      </TopicDetailProviders>
    </Container>
  );
}
