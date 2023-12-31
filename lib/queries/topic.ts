import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { Topic } from '~/lib/types/topic';
import { getRandomColor } from '~/lib/utils';

export async function getTopicsCount() {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const count = await database.topic.count({
    where: { subject: { userId: session.user.id } },
  });

  return count;
}

export async function getAllTopics(): Promise<Topic[]> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const topics = await database.topic.findMany({
    where: { subject: { userId: session.user.id } },
    include: { subject: true },
    orderBy: { createdAt: 'desc' },
  });

  return topics.map((topic) => {
    return {
      id: topic.id,
      title: topic.title,
      subjectId: topic.subjectId,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      subject: {
        id: topic.subject.id,
        title: topic.subject.title,
        color: getRandomColor(topic.subject.id),
      },
    };
  });
}

export async function getLatestTopics({
  limit,
}: {
  limit: number;
}): Promise<Topic[]> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const topics = await database.topic.findMany({
    where: { subject: { userId: session.user.id } },
    include: { subject: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return topics.map((topic) => {
    return {
      id: topic.id,
      title: topic.title,
      subjectId: topic.subjectId,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      subject: {
        id: topic.subject.id,
        title: topic.subject.title,
        color: getRandomColor(topic.subject.id),
      },
    };
  });
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const topic = await database.topic.findUnique({
    include: { subject: true },
    where: { id, subject: { userId: session.user.id } },
  });

  if (topic === null) return null;

  return {
    id: topic.id,
    title: topic.title,
    subjectId: topic.subjectId,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
    subject: {
      id: topic.subject.id,
      title: topic.subject.title,
      color: getRandomColor(topic.subject.id),
    },
  };
}

export async function getAllTopicBySubjectId(
  subjectId: string
): Promise<Topic[]> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const topics = await database.topic.findMany({
    include: { subject: true },
    where: { subject: { id: subjectId, userId: session.user.id } },
  });

  return topics.map((topic) => {
    return {
      id: topic.id,
      title: topic.title,
      subjectId: topic.subjectId,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      subject: {
        id: topic.subject.id,
        title: topic.subject.title,
        color: getRandomColor(topic.subject.id),
      },
    };
  });
}
