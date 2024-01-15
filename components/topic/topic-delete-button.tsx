'use client';

import { useFormState } from 'react-dom';

import { Icons } from '~/components/icons';
import { SubmitButton } from '~/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { deleteTopic } from '~/lib/actions/topic';
import { deleteTopicSchema } from '~/lib/schema/topic';
import { ActionState } from '~/lib/types/action';

const initialState: ActionState<typeof deleteTopicSchema> = {
  message: null,
  error: null,
  validationErrors: null,
};

interface TopicDeleteButtonProps {
  topicId: string;
}

export function TopicDeleteButton({ topicId }: TopicDeleteButtonProps) {
  const [state, formAction] = useFormState(deleteTopic, initialState);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="shrink-0 border border-white"
        >
          <Icons.Delete size={20} />
          <span className="sr-only">Delete topic</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete this topic?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the topic
            and remove all your histories within the topic.
          </AlertDialogDescription>

          {state.error && (
            <Alert variant="destructive" className="mt-2 text-left">
              <Icons.Error size={20} />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="topic" value={topicId} />
            <SubmitButton className="w-full">Yes, Delete</SubmitButton>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
