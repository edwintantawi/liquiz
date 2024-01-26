import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { subjectFileStorage } from '~/lib/storage';
import { Subject, SubjectDetail } from '~/lib/types/subject';
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
    where: { userId: session.user.id },
    include: { _count: { select: { topics: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return subjects.map((subject) => {
    return {
      id: subject.id,
      title: subject.title,
      description: subject.description,
      color: getRandomColor(subject.id),
      numberOfTopics: subject._count.topics,
    };
  });
}

export async function getSubjectById(
  id: string
): Promise<SubjectDetail | null> {
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
    title: subject.title,
    description: subject.description,
    color: getRandomColor(subject.id),
    fileUrl: subjectFileStorage.getPublicUrl(subject.file),
    numberOfTopics: subject._count.topics,
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt,
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
      title: subject.title,
      description: subject.description,
      color: getRandomColor(subject.id),
      numberOfTopics: subject._count.topics,
    };
  });
}
