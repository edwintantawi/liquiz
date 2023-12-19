import { notFound } from 'next/navigation';

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
    <pre>
      <code>{JSON.stringify(subject, null, 2)}</code>
    </pre>
  );
}
