import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '~/components/container';
import { DetailHeader } from '~/components/detail-header';
import { Icons } from '~/components/icons';
import { Section } from '~/components/section';
import { CreateTopicButton } from '~/components/topic/create-topic-button';
import { TopicItem } from '~/components/topic/topic-item';
import { Button } from '~/components/ui/button';
import { getSubjectById } from '~/lib/queries/subject';
import { getAllTopicBySubjectId } from '~/lib/queries/topic';

interface SubjectDetailPageProps {
  params: { subject_id: string };
}

export default async function SubjectDetailPage({
  params,
}: SubjectDetailPageProps) {
  const [subject, topics] = await Promise.all([
    getSubjectById(params.subject_id),
    getAllTopicBySubjectId(params.subject_id),
  ]);

  if (subject === null) notFound();

  return (
    <Container className="p-0">
      <DetailHeader
        title={subject.title}
        subtitle={subject.description || '<no description>'}
        color={subject.color}
        startAdornment={
          <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
            {topics.length} {topics.length <= 1 ? 'Topic' : 'Topics'}
          </span>
        }
      >
        <Button asChild size="icon" variant="outline" className="shrink-0">
          <Link href="/subjects">
            <Icons.Subject size={20} />
            <span className="sr-only">View all subjects</span>
          </Link>
        </Button>
        <Button
          asChild
          className="grid w-full grid-cols-[1fr,auto] justify-between"
        >
          <Link href="#">
            <div className="flex items-center gap-2 truncate">
              <Icons.File size={20} className="shrink-0" />
              <span className="truncate">Document file</span>
            </div>
            <Icons.ExternalLink size={20} className="shrink-0" />
          </Link>
        </Button>
      </DetailHeader>

      <div className="p-3">
        <Section
          title={`Topics (${topics.length})`}
          description="List of topics that you have created"
          endAdornment={
            <Button asChild variant="outline" size="icon">
              <Link
                href={{
                  pathname: '/topics/new',
                  search: `subject_id=${subject.id}`,
                }}
              >
                <Icons.Plus size={20} />
                <span className="sr-only">Add new topic</span>
              </Link>
            </Button>
          }
        >
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
              <CreateTopicButton subjectId={subject.id} />
            </li>
          </ul>
        </Section>
      </div>
    </Container>
  );
}
