import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { CreateTopicForm } from '~/components/topic/create-topic-form';
import { getMaxNumberOfQuestionsBySubjectId } from '~/lib/queries/document';
import { getAllSubjects } from '~/lib/queries/subject';

export const metadata = {
  title: 'Create Topic',
};

interface CreateTopicPageProps {
  searchParams: { subject_id?: string };
}

export default async function CreateTopicPage({
  searchParams,
}: CreateTopicPageProps) {
  const subjects = await getAllSubjects();

  const maxNumberOfQuestions = await getMaxNumberOfQuestionsBySubjectId(
    searchParams.subject_id
  );

  return (
    <Container>
      <Header
        title="Create New Topic"
        description="A topic about the questions you want!"
      />

      <CreateTopicForm
        subjects={subjects}
        maxNumberOfQuestions={maxNumberOfQuestions}
      />
    </Container>
  );
}
