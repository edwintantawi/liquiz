'use server';

import { redirect } from 'next/navigation';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { tasksQueue } from '~/lib/queue';
import { createTopicSchema, submitTopicAnswerSchema } from '~/lib/schema/topic';
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
    topicId = topic.id;

    // TODO: call LLM to create questions from the topic
    //       publish message to queue or perform the action directly
    await tasksQueue.publish({ subjectId: subject.id, topicId: topic.id });
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

export const submitTopicAnswer: ServerAction<
  typeof submitTopicAnswerSchema
> = async (_, formData) => {
  const rawFormData = Object.fromEntries(formData.entries());

  const answers = [];
  for (const [key, value] of Object.entries(rawFormData)) {
    if (!key.startsWith('question.')) continue;

    answers.push({
      question: key.replace('question.', ''),
      option: value,
    });
  }

  const formatedFormData = {
    topic: rawFormData.topic,
    answers,
  };

  console.log(formatedFormData);

  // TODO: validate formatedFormData

  return {
    error: null,
    message: JSON.stringify(formatedFormData, null, 2),
    validationErrors: null,
  };
};
