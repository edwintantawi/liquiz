import { auth } from '~/lib/auth';
import { database } from '~/lib/database';

export async function getRetrievalTimeByTargetId(targetId: string) {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const result = await database.retrievalTime.findFirst({
    select: { duration: true },
    where: { targetId },
    orderBy: { createdAt: 'desc' },
  });

  if (result === null) return null;

  return result.duration;
}
