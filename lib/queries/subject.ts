import seedColor from 'seed-color';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { delay } from '~/lib/utils';

export async function getSubjectsCount() {
  // TODO: fetch data from database
  await delay(5000);
  return 6;
}

type Subject = {
  id: string;
  title: string;
  description: string;
  numberOfTopics: number;
  colorCode: string;
};

export async function getLatestSubjects({
  limit,
}: {
  limit: number;
}): Promise<Subject[]> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const subjects = await database.subject.findMany({
    where: { userId: session.user?.id },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return subjects.map((subject) => {
    return {
      id: subject.id,
      title: subject.title,
      description: subject.description,
      colorCode: seedColor(subject.id).toHex(),
      numberOfTopics: 0,
    };
  });
}
