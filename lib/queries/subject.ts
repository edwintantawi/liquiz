import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { Subject } from '~/lib/types/subject';
import { getRandomColor } from '~/lib/utils';

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
    include: { _count: { select: { topics: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return subjects.map((subject) => {
    return {
      id: subject.id,
      userId: subject.userId,
      title: subject.title,
      description: subject.description,
      rawFile: subject.rawFile,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      color: getRandomColor(subject.id),
      numberOfTopics: subject._count.topics,
    };
  });
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const subject = await database.subject.findUnique({
    where: { id, userId: session.user.id },
    include: { _count: { select: { topics: true } } },
  });

  if (subject === null) return null;

  return {
    id: subject.id,
    userId: subject.userId,
    title: subject.title,
    description: subject.description,
    rawFile: subject.rawFile,
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt,
    color: getRandomColor(subject.id),
    numberOfTopics: subject._count.topics,
  };
}

export async function getAllSubjects(): Promise<Subject[]> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const subjects = await database.subject.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { topics: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return subjects.map((subject) => {
    return {
      id: subject.id,
      userId: subject.userId,
      title: subject.title,
      description: subject.description,
      rawFile: subject.rawFile,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      color: getRandomColor(subject.id),
      numberOfTopics: subject._count.topics,
    };
  });
}
