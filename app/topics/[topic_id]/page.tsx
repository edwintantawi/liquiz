import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '~/components/container';
import { DetailHeader } from '~/components/detail-header';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { getTopicById } from '~/lib/queries/topic';

interface TopicDetailPageProps {
  params: { topic_id: string };
}

export default async function TopicDetailPage({
  params,
}: TopicDetailPageProps) {
  const topic = await getTopicById(params.topic_id);

  if (topic === null) notFound();

  return (
    <Container>
      <DetailHeader
        title={topic.title}
        subtitle={topic.subject.title}
        color={topic.subject.color}
      >
        <Button asChild size="icon" variant="outline" className="shrink-0">
          <Link href={`/subjects/${topic.subject.id}`}>
            <Icons.Back size={20} />
            <span className="sr-only">
              Back to {topic.subject.title} subject
            </span>
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href={`/topics/${topic.id}/histories`}>
            <Icons.History size={20} className="shrink-0" />
            <span>Histories</span>
          </Link>
        </Button>
      </DetailHeader>

      <div className="p-3" />
    </Container>
  );
}
