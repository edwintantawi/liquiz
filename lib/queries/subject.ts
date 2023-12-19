import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { Subject } from '~/lib/entities/subject';

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
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return subjects.map((subject) => {
    return new Subject({
      id: subject.id,
      title: subject.title,
      description: subject.description,
      numberOfTopics: 0,
      rawFile: subject.rawFile,
    });
  });
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const subject = await database.subject.findUnique({
    where: { id, userId: session.user.id },
  });

  if (subject === null) return null;

  return new Subject({
    id: subject.id,
    title: subject.title,
    description: subject.description,
    numberOfTopics: 0,
    rawFile: subject.rawFile,
  });
}

export async function getAllSubjects(): Promise<Subject[]> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const subjects = await database.subject.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return subjects.map((subject) => {
    return new Subject({
      id: subject.id,
      title: subject.title,
      description: subject.description,
      numberOfTopics: 0,
      rawFile: subject.rawFile,
    });
  });
}
