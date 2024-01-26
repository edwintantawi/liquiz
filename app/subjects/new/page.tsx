import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { CreateSubjectForm } from '~/components/subject/create-subject-form';

export const metadata = {
  title: 'Create Subject',
};

export default function CreateSubjectPage() {
  return (
    <Container>
      <Header
        title="Create New Subject"
        description="Introduce a Fresh Learning Focus!"
      />
      <CreateSubjectForm />
    </Container>
  );
}
