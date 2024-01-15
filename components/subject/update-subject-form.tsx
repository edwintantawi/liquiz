'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';

import { Icons } from '~/components/icons';
import { SubmitButton } from '~/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Input, InputMessage } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { updateSubject } from '~/lib/actions/subject';
import { updateSubjectSchema } from '~/lib/schema/subject';
import { ActionState } from '~/lib/types/action';

const initialState: ActionState<typeof updateSubjectSchema> = {
  message: null,
  error: null,
  validationErrors: null,
};

interface UpdateSubjectFormProps {
  subjectId: string;
  initialTitle: string;
  initialDescription: string;
}

export function UpdateSubjectForm({
  subjectId,
  initialTitle,
  initialDescription,
}: UpdateSubjectFormProps) {
  const [state, formAction] = useFormState(updateSubject, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="subject" value={subjectId} />
      <div className="space-y-1">
        <Label required htmlFor="title">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Computer Science"
          defaultValue={initialTitle}
        />
        <InputMessage>{state?.validationErrors?.title?.[0]}</InputMessage>
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="My lovely subject"
          defaultValue={initialDescription}
        />
        <InputMessage>{state?.validationErrors?.description?.[0]}</InputMessage>
      </div>

      {state.error && (
        <Alert variant="destructive">
          <Icons.Error size={20} />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2 py-2">
        <SubmitButton className="w-full">Update</SubmitButton>
      </div>
    </form>
  );
}
