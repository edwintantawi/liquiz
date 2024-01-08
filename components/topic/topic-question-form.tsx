'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';

import { Icons } from '~/components/icons';
import { Question } from '~/components/question';
import { SubmitButton } from '~/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { submitQuestionAnswer } from '~/lib/actions/question';
import { submitQuestionAnswerSchema } from '~/lib/schema/question';
import { ActionState } from '~/lib/types/action';
import { Question as QuestionType } from '~/lib/types/question';

const initialState: ActionState<typeof submitQuestionAnswerSchema> = {
  message: null,
  error: null,
  validationErrors: null,
};

interface TopicQuestionFormProps {
  topicId: string;
  subjectId: string;
  questions: QuestionType[];
}

export function TopicQuestionForm({
  topicId,
  subjectId,
  questions,
}: TopicQuestionFormProps) {
  const [state, formAction] = useFormState(submitQuestionAnswer, initialState);

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
                  {option.statement}
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
    </form>
  );
}
