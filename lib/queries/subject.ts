import seedColor from 'seed-color';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';

export async function getSubjectsCount() {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const count = await database.subject.count({
    where: { userId: session.user.id },
  });

  return count;
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
