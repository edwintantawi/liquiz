import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { CreateTopicForm } from '~/components/topic/create-topic-form';
import { getAllSubjects } from '~/lib/queries/subject';

export default async function CreateTopicPage() {
  const subjects = await getAllSubjects();

  return (
    <Container>
      <Header
        title="Create New Topic"
        description="A topic about the questions you want!"
      />

      <CreateTopicForm subjects={subjects} />
    </Container>
  );
}
