'use server';

import { redirect } from 'next/navigation';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { createTopicSchema } from '~/lib/schema/topic';
import { ServerAction } from '~/lib/types/action';

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
    select: { userId: true },
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

  let topicId;
  try {
    const topic = await database.topic.create({
      select: { id: true },
      data: {
        subjectId: validatedForm.data.subject,
        title: validatedForm.data.title,
      },
    });
    topicId = topic.id;

    // TODO: call LLM to create questions from the topic
    //       publish message to queue or perform the action directly
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