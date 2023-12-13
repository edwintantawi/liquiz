import { Header } from '~/components/header';
import { CreateSubjectForm } from '~/components/subject/create-subject-form';

export default function CreateSubjectPage() {
  return (
    <>
      <Header
        title="Create New Subject"
        description="Introduce a Fresh Learning Focus!"
      />

      <CreateSubjectForm />
    </>
  );
}
