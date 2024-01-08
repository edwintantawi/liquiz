import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { HistoryDetail } from '~/lib/types/history';
import { getRandomColor } from '~/lib/utils';

export async function getHistoryById({
  historyId,
  topicId,
}: {
  historyId: string;
  topicId: string;
}): Promise<HistoryDetail | null> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const history = await database.history.findUnique({
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          numberOfQuestions: true,
          subject: { select: { id: true, title: true } },
        },
      },
    },
    where: { id: historyId, topicId },
  });

  if (history === null) return null;

  const questions = await database.question.findMany({
    include: { options: true, choices: { where: { historyId } } },
    where: { topicId: topicId },
  });

  return {
    id: history.id,
    score: history.score,
    createdAt: history.createdAt,
    topic: {
      id: history.topic.id,
      title: history.topic.title,
      numberOfQuestions: history.topic.numberOfQuestions,
      subject: {
        id: history.topic.subject.id,
        title: history.topic.subject.title,
        color: getRandomColor(history.topic.subject.id),
      },
    },
    questions: questions.map((question) => {
      const choice = question.choices.find(
        (choice) => choice.questionId === question.id
      )!;

      return {
        id: question.id,
        statement: question.statement,
        isCorrect:
          choice.optionId ===
          question.options.find((option) => option.isCorrect)!.id,
        options: question.options.map((option) => ({
          id: option.id,
          statement: option.statement,
          description: option.description,
        })),
        choice: {
          id: choice.id,
          optionId: choice.optionId,
        },
      };
    }),
  };
}
