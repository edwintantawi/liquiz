import { Icons } from '~/components/icons';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

export function TopicListEmpty() {
  return (
    <Alert>
      <Icons.Info size={20} />
      <AlertTitle>You don&apos;t have any single topic yet!</AlertTitle>
      <AlertDescription>
        Create your first topic from the subject you have created, and start
        exploring your subject on the topic you want
      </AlertDescription>
    </Alert>
  );
}
