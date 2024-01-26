import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { SearchRecords } from '~/lib/types/search';
import { getRandomColor } from '~/lib/utils';

export async function searchByKeyword(keyword: string): Promise<SearchRecords> {
  const session = await auth();

  if (!session.isAuthenticated) {
    throw new Error('UNAUTHENTICATED');
  }

  const subjects = await database.subject.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      _count: { select: { topics: true } },
    },
    where: {
      userId: session.user.id,
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  const topics = await database.topic.findMany({
    select: {
      id: true,
      title: true,
      subject: { select: { id: true, title: true } },
    },
    where: {
      subject: { userId: session.user.id },
      title: { contains: keyword, mode: 'insensitive' },
    },
    orderBy: { createdAt: 'desc' },
  });

  const questions = await database.question.findMany({
    select: {
      id: true,
      statement: true,
      topic: {
        select: {
          id: true,
          title: true,
          subject: { select: { id: true, title: true } },
        },
      },
      options: { select: { id: true, statement: true } },
    },
    where: {
      topic: { subject: { userId: session.user.id } },
      OR: [
        { statement: { contains: keyword, mode: 'insensitive' } },
        {
          options: {
            some: { statement: { contains: keyword, mode: 'insensitive' } },
          },
        },
      ],
    },
    orderBy: { topic: { createdAt: 'desc' } },
  });

  return {
    subjects: subjects.map((subject) => ({
      id: subject.id,
      title: subject.title,
      description: subject.description,
      numberOfTopics: subject._count.topics,
      color: getRandomColor(subject.id),
    })),
    topics: topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      subject: {
        id: topic.subject.id,
        title: topic.subject.title,
        color: getRandomColor(topic.subject.id),
      },
    })),
    questions: questions.map((question) => ({
      id: question.id,
      statement: question.statement,
      topic: {
        id: question.topic.id,
        title: question.topic.title,
      },
      subject: {
        id: question.topic.subject.id,
        title: question.topic.subject.title,
        color: getRandomColor(question.topic.subject.id),
      },
      options: question.options.map((option) => ({
        id: option.id,
        statement: option.statement,
      })),
    })),
  };
}
