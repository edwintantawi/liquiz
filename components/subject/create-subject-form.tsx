'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';

import { Icons } from '~/components/icons';
import { SubmitButton } from '~/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Input, InputMessage } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { createSubject } from '~/lib/actions/subject';
import { createSubjectSchema, MAX_FILE_SIZE } from '~/lib/schema/subject';
import { ActionState } from '~/lib/types/action';

const initialState: ActionState<typeof createSubjectSchema> = {
  message: null,
  error: null,
  validationErrors: null,
};

export function CreateSubjectForm() {
  const [state, formAction] = useFormState(createSubject, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-1">
        <Label required htmlFor="title">
          Title
        </Label>
        <Input id="title" name="title" placeholder="Computer Science" />
        <InputMessage>{state?.validationErrors?.title?.[0]}</InputMessage>
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="My lovely subject"
        />
        <InputMessage>{state?.validationErrors?.description?.[0]}</InputMessage>
      </div>
      <div className="space-y-1">
        <div>
          <Label required htmlFor="document">
            Document
          </Label>
          <InputMessage className="text-muted-foreground">
            Should be in <code className="font-semibold">PDF</code> format and
            have a maximum size of{' '}
            <code className="font-semibold">{MAX_FILE_SIZE}MB</code>.
          </InputMessage>
        </div>
        <Input
          id="document"
          type="file"
          name="document"
          accept="application/pdf"
        />
        <InputMessage>{state?.validationErrors?.document?.[0]}</InputMessage>
      </div>

      {state.error && (
        <Alert variant="destructive">
          <Icons.Error size={20} />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2 py-2">
        <SubmitButton className="w-full">Create</SubmitButton>
      </div>
    </form>
  );
}
