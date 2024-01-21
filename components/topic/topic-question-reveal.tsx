import { Question } from '~/components/question';
import { Question as QuestionType } from '~/lib/types/question';

interface TopicQuestionRevealProps {
  questions: QuestionType[];
}

export function TopicQuestionReveal({ questions }: TopicQuestionRevealProps) {
  return (
    <div className="px-3 py-4">
      <ul className="ml-5 list-decimal space-y-8">
        {questions.map((question) => (
          <li key={question.id} className="space-y-3">
            <Question statement={question.statement}>
              {question.options.map((option) => (
                <Question.Option
                  reveal
                  required
                  readOnly
                  key={option.id}
                  name={`question.${question.id}`}
                  value={option.id}
                  defaultChecked={option.isCorrect}
                  isCorrect={option.isCorrect}
                  description={option.description}
                >
                  {option.statement}
                </Question.Option>
              ))}
            </Question>
          </li>
        ))}
      </ul>
    </div>
  );
}
