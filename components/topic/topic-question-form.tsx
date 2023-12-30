'use client';

import * as React from 'react';
import Link from 'next/link';

import { questions } from '~/app/topics/[topic_id]/data';
import { Question } from '~/components/question';
import { SubmitButton } from '~/components/submit-button';
import { Button } from '~/components/ui/button';

interface TopicQuestionFormProps {
  topicId: string;
  subjectId: string;
}

export function TopicQuestionForm({
  topicId,
  subjectId,
}: TopicQuestionFormProps) {
  return (
    <form className="px-3 py-4">
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
