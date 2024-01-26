'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Icons } from '~/components/icons';
import { Question, QuestionListSkeleton } from '~/components/question';
import { SubmitButton } from '~/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { submitQuestionAnswer } from '~/lib/actions/question';
import { submitQuestionAnswerSchema } from '~/lib/schema/question';
import { ActionState } from '~/lib/types/action';
import { Question as QuestionType } from '~/lib/types/question';
import { cn } from '~/lib/utils';

const initialState: ActionState<typeof submitQuestionAnswerSchema> = {
  message: null,
  error: null,
  validationErrors: null,
};

interface TopicQuestionFormProps {
  topicId: string;
  subjectId: string;
  totalQuestions: number;
  questions: QuestionType[];
}

export function TopicQuestionForm({
  topicId,
  subjectId,
  totalQuestions,
  questions,
}: TopicQuestionFormProps) {
  const queryClient = useQueryClient();
  const [state, formAction] = useFormState(submitQuestionAnswer, initialState);
  const [numberOfAvailableQuestions, setNumberOfAvailableQuestions] =
    React.useState<number>(questions.length);

  const isQuestionsBeingGenerated = numberOfAvailableQuestions < totalQuestions;

  const { data } = useQuery({
    queryKey: ['questions', topicId],
    queryFn: async () => {
      const response = await fetch(`/api/topics/${topicId}/questions`);
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const questions = (await response.json()) as QuestionType[];
      setNumberOfAvailableQuestions(questions.length);
      return questions;
    },
    enabled: isQuestionsBeingGenerated,
    initialData: questions,
    refetchInterval: 10_000,
  });

  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['retrieval-time', topicId] });
  }, [queryClient, topicId, numberOfAvailableQuestions]);

  return (
    <form action={formAction} className="px-3 py-4">
      <input type="hidden" name="topic" value={topicId} />
      <div className="mb-6">
        <ul className="ml-5 list-decimal space-y-8">
          {data.map((question) => (
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

        {isQuestionsBeingGenerated && (
          <Alert
            className={cn('mb-4', {
              'mt-4': numberOfAvailableQuestions !== 0,
            })}
          >
            <Icons.Loader size={20} className="animate-spin" />
            <AlertTitle>Please wait, this will take time 👀</AlertTitle>
            <AlertDescription className="text-balance">
              Your question is being generated, it may take a few minutes
            </AlertDescription>
          </Alert>
        )}

        <QuestionListSkeleton
          count={totalQuestions - numberOfAvailableQuestions}
        />
      </div>

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

        <SubmitButton disabled={isQuestionsBeingGenerated}>Submit</SubmitButton>
      </div>
    </form>
  );
}
