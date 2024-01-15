'use server';

import { redirect } from 'next/navigation';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { createVectorStore } from '~/lib/langchain/vector-store';
import { tasksQueue } from '~/lib/queue';
import { createTopicSchema, deleteTopicSchema } from '~/lib/schema/topic';
import { ServerAction } from '~/lib/types/action';
import { TopicMessage } from '~/lib/types/topic';
import { splitIntoParts } from '~/lib/utils';

const vectorStore = createVectorStore();

export const createTopic: ServerAction<typeof createTopicSchema> = async (
  _,
  formData
) => {
  const validatedForm = createTopicSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!validatedForm.success) {
    return {
      validationErrors: validatedForm.error.flatten().fieldErrors,
      error: null,
      message: null,
    };
  }

  const session = await auth();
  if (!session.isAuthenticated) {
    return {
      validationErrors: null,
      error: 'User must be authenticated to perform this action',
      message: null,
    };
  }

  const subject = await database.subject.findUnique({
    include: { _count: { select: { documents: true } } },
    where: { id: validatedForm.data.subject },
  });

  if (subject === null) {
    return {
      validationErrors: null,
      error: 'Subject not found',
      message: null,
    };
  }

  if (session.user.id !== subject.userId) {
    return {
      validationErrors: null,
      error: 'User must be the owner of the subject to perform this action',
      message: null,
    };
  }

  if (validatedForm.data.numberOfQuestions > subject._count.documents) {
    return {
      validationErrors: {
        numberOfQuestions: [
          `Maximum number of questions for this subject is ${subject._count.documents}`,
        ],
      },
      error: null,
      message: null,
    };
  }

  let topicId;
  try {
    const topic = await database.topic.create({
      select: { id: true },
      data: {
        subjectId: validatedForm.data.subject,
        title: validatedForm.data.title,
        numberOfQuestions: validatedForm.data.numberOfQuestions,
      },
    });

    try {
      const similaritySearchResult =
        await vectorStore.similaritySearchWithScore(
          validatedForm.data.title,
          validatedForm.data.numberOfQuestions,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          { subject_id: { equals: subject.id } }
        );

      const parts = splitIntoParts(similaritySearchResult).map((part) => {
        return part.map(([document]) => document.pageContent);
      });

      const messages: TopicMessage[] = parts.map((contexts) => {
        return {
          subject: { id: subject.id },
          topic: {
            id: topic.id,
            title: validatedForm.data.title,
            numberOfQuestions: contexts.length,
          },
          contexts,
        };
      });

      const queuesPromises = messages.map((message) => {
        return tasksQueue.publish(message);
      });

      await Promise.all(queuesPromises);

      topicId = topic.id;
    } catch (error) {
      await database.topic.delete({ where: { id: topic.id } });
      throw error;
    }
  } catch (error) {
    console.error(error);
    return {
      validationErrors: null,
      error: 'Failed to store new topic',
      message: null,
    };
  }

  redirect(`/topics/${topicId}`);
};

export const deleteTopic: ServerAction<typeof deleteTopicSchema> = async (
  _,
  formData
) => {
  const validatedForm = deleteTopicSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!validatedForm.success) {
    return {
      validationErrors: validatedForm.error.flatten().fieldErrors,
      error: null,
      message: null,
    };
  }

  const session = await auth();
  if (!session.isAuthenticated) {
    return {
      validationErrors: null,
      error: 'User must be authenticated to perform this action',
      message: null,
    };
  }

  try {
    const topic = await database.topic.findUnique({
      select: { subject: { select: { userId: true } } },
      where: { id: validatedForm.data.topic },
    });

    if (topic === null) {
      return {
        validationErrors: null,
        error: 'Topic not found',
        message: null,
      };
    }

    if (session.user.id !== topic.subject.userId) {
      return {
        validationErrors: null,
        error: 'User must be the owner of the topic to perform this action',
        message: null,
      };
    }

    await database.topic.delete({
      where: {
        id: validatedForm.data.topic,
        subject: { userId: session.user.id },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      validationErrors: null,
      error: 'Failed to delete topic',
      message: null,
    };
  }

  redirect('/topics');
};
