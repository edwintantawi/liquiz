import { auth } from '~/lib/auth';
import { colors } from '~/lib/color';
import { database } from '~/lib/database';
import { Topic } from '~/lib/types/topic';
import { delay, getRandomColor } from '~/lib/utils';

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
}): Promise<unknown> {
  // TODO: fetch data from database
  await delay(4000);

  return [
    {
      id: '1',
      title: 'Central Processing Unit',
      subject: {
        id: '1',
        title: 'Computer Science',
        color: colors[0],
      },
    },
    {
      id: '2',
      title: 'HTTP Protocol',
      subject: {
        id: '1',
        title: 'Computer Science',
        color: colors[0],
      },
    },
    {
      id: '3',
      title: 'Browser APIs',
      subject: {
        id: '5',
        title: 'Javascript',
        color: colors[8],
      },
    },
    {
      id: '4',
      title: 'State Law',
      subject: {
        id: '3',
        title: 'Citizenship',
        color: colors[4],
      },
    },
  ].slice(0, limit);
}
