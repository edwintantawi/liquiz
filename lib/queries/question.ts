import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { Question } from '~/lib/types/question';

export async function getQuestionsByTopicId(
  topicId: string
): Promise<Question[]> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  return database.question.findMany({
    where: { topicId, topic: { subject: { userId: session.user.id } } },
    include: { options: true },
  });
}
