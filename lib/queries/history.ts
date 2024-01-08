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

  return {
    id: history.id,
    score: history.score,
    createdAt: history.createdAt,
    topic: {
      id: history.topic.id,
      title: history.topic.title,
      numberOfQuestions: history.topic.numberOfQuestions,
      subject: {
        title: history.topic.subject.title,
        color: getRandomColor(history.topic.subject.id),
      },
    },
  };
}
