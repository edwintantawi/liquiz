'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';

import { Icons } from '~/components/icons';
import { SubmitButton } from '~/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Input, InputMessage } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { createTopic } from '~/lib/actions/topic';
import { createTopicSchema } from '~/lib/schema/topic';
import { ActionState } from '~/lib/types/action';
import { Subject } from '~/lib/types/subject';

const initialState: ActionState<typeof createTopicSchema> = {
  message: null,
  error: null,
  validationErrors: null,
};

interface CreateTopicFormProps {
  subjects: Subject[];
  maxNumberOfQuestions: number;
}

export function CreateTopicForm({
  subjects,
  maxNumberOfQuestions,
}: CreateTopicFormProps) {
  const [state, formAction] = useFormState(createTopic, initialState);
  const [numberOfQuestions, setNumberOfQuestions] = React.useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSubjectId = searchParams.get('subject_id') ?? undefined;

  const isSubjectAvailable = maxNumberOfQuestions !== 0;

  const handleSubjectValueChange = (value: string) => {
    router.push(`/topics/new?subject_id=${value}`);
  };

  const handleNumberOfQuestionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.currentTarget.value;

    if (value === '') return setNumberOfQuestions('');

    if (Number(value) > maxNumberOfQuestions) return;

    setNumberOfQuestions(value);
  };

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-1">
        <Label required htmlFor="description">
          Subject
        </Label>
        <Select
          name="subject"
          defaultValue={initialSubjectId}
          onValueChange={handleSubjectValueChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.title}
              </SelectItem>
            ))}
            {subjects.length === 0 && (
              <SelectItem value="null" disabled>
                No subjects found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <InputMessage>{state?.validationErrors?.subject?.[0]}</InputMessage>
      </div>
      <div className="space-y-1">
        <Label required htmlFor="title">
          Title
        </Label>
        <Input id="title" name="title" placeholder="Milkyway Galaxy" />
        <InputMessage>{state?.validationErrors?.title?.[0]}</InputMessage>
      </div>
      <div className="space-y-1">
        <div>
          <Label required htmlFor="number-of-questions">
            Number of Questions
          </Label>
          {isSubjectAvailable ? (
            <InputMessage className="text-muted-foreground">
              The maximum number of questions is{' '}
              <code className="font-semibold">{maxNumberOfQuestions}</code>
            </InputMessage>
          ) : (
            <InputMessage className="text-muted-foreground">
              Please choose the <code className="font-semibold">subject</code>{' '}
              first above!
            </InputMessage>
          )}
        </div>
        <Input
          id="number-of-questions"
          type="number"
          name="numberOfQuestions"
          placeholder="How many questions?"
          disabled={!isSubjectAvailable}
          max={maxNumberOfQuestions}
          value={numberOfQuestions}
          onChange={handleNumberOfQuestionsChange}
        />
        <InputMessage>
          {state?.validationErrors?.numberOfQuestions?.[0]}
        </InputMessage>
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
