'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';

import { questions } from '~/app/topics/[topic_id]/data';
import { Icons } from '~/components/icons';
import { Question } from '~/components/question';
import { SubmitButton } from '~/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { submitTopicQuestion } from '~/lib/actions/topic';
import { submitTopicQuestionSchema } from '~/lib/schema/topic';
import { ActionState } from '~/lib/types/action';

const initialState: ActionState<typeof submitTopicQuestionSchema> = {
  message: null,
  error: null,
  validationErrors: null,
};

interface TopicQuestionFormProps {
  topicId: string;
  subjectId: string;
}

export function TopicQuestionForm({
  topicId,
  subjectId,
}: TopicQuestionFormProps) {
  const [state, formAction] = useFormState(submitTopicQuestion, initialState);

  return (
    <form action={formAction} className="px-3 py-4">
      <input type="hidden" name="topic" value={topicId} />
      <ul className="mb-6 ml-5 list-decimal space-y-8">
        {questions.map((question) => (
          <li key={question.id} className="space-y-3">
            <Question statement={question.statement}>
              {question.options.map((option) => (
                <Question.Option
                  required
                  key={option.id}
                  name={`question.${question.id}`}
                  value={option.id}
                >
                  {option.title}
                </Question.Option>
              ))}
            </Question>
          </li>
        ))}
      </ul>

      {state.error && (
        <Alert variant="destructive">
          <Icons.Error size={20} />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-12 flex items-center justify-between gap-2">
        <div className="space-x-2">
          <Button asChild variant="secondary">
            <Link href={`/subjects/${subjectId}`}>Back to subject</Link>
          </Button>
          <Button type="reset" variant="destructive">
            Clear
          </Button>
        </div>

        <SubmitButton>Submit</SubmitButton>
      </div>

      {/* TODO: remove this code (used for debug) */}
      {state.message && (
        <pre className="mt-8 whitespace-pre-wrap rounded-md border bg-muted p-4">
          <code>{state.message}</code>
        </pre>
      )}
    </form>
  );
}
