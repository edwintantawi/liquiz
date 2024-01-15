import { Icons } from '~/components/icons';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

export function SubjectListEmpty() {
  return (
    <Alert>
      <Icons.Info size={20} />
      <AlertTitle>You don&apos;t have any single subject yet!</AlertTitle>
      <AlertDescription>
        Please create your subject first to start your journey to becoming an
        expert in that subject
      </AlertDescription>
    </Alert>
  );
}
