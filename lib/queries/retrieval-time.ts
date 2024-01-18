import { database } from '~/lib/database';

export async function getRetrievalTimeByTargetId(targetId: string) {
  const result = await database.retrievalTime.findFirst({
    select: { duration: true },
    where: { targetId },
  });

  if (result === null) return null;

  return result.duration;
}
