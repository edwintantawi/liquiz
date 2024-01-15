import { notFound } from 'next/navigation';

import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { UpdateSubjectForm } from '~/components/subject/update-subject-form';
import { getSubjectById } from '~/lib/queries/subject';

interface EditSubjectPageProps {
  params: { subject_id: string };
}

export default async function EditSubjectPage({
  params,
}: EditSubjectPageProps) {
  const subject = await getSubjectById(params.subject_id);

  if (subject === null) notFound();

  return (
    <Container>
      <Header
        title="Update Subject"
        description="Change your subject information!"
      />

      <UpdateSubjectForm
        subjectId={subject.id}
        initialTitle={subject.title}
        initialDescription={subject.description}
      />
    </Container>
  );
}
