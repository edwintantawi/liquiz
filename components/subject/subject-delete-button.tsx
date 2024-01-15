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
import { deleteSubject } from '~/lib/actions/subject';
import { deleteSubjectSchema } from '~/lib/schema/subject';
import { ActionState } from '~/lib/types/action';

const initialState: ActionState<typeof deleteSubjectSchema> = {
  message: null,
  error: null,
  validationErrors: null,
};

interface SubjectDeleteButtonProps {
  subjectId: string;
}

export function SubjectDeleteButton({ subjectId }: SubjectDeleteButtonProps) {
  const [state, formAction] = useFormState(deleteSubject, initialState);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="shrink-0 border border-white"
        >
          <Icons.Delete size={20} />
          <span className="sr-only">Delete subject</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete this subject?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            subject and remove all your topics within the subject.
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
            <input type="hidden" name="subject" value={subjectId} />
            <SubmitButton className="w-full">Yes, Delete</SubmitButton>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
