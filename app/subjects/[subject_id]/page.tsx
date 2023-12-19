import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '~/components/container';
import { Icons } from '~/components/icons';
import { SubjectHeader } from '~/components/subject/subject-header';
import { Button } from '~/components/ui/button';
import { getSubjectById } from '~/lib/queries/subject';

interface SubjectDetailPageProps {
  params: { subject_id: string };
}

export default async function SubjectDetailPage({
  params,
}: SubjectDetailPageProps) {
  const subject = await getSubjectById(params.subject_id);

  if (subject === null) notFound();

  return (
    <Container className="p-0">
      <SubjectHeader
        title={subject.title}
        description={subject.description}
        color={subject.color}
        startAdornment={
          <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
            {subject.numberOfTopics}{' '}
            {subject.numberOfTopics <= 1 ? 'Topic' : 'Topics'}
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
          variant="outline"
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
      </SubjectHeader>

      <div className="p-3" />
    </Container>
  );
}
