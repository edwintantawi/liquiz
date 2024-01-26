'use server';

import { redirect } from 'next/navigation';

import { HistoryStatus } from '@prisma/client';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { historySummaryQueue } from '~/lib/queue';
import { submitQuestionAnswerSchema } from '~/lib/schema/question';
import { ServerAction } from '~/lib/types/action';
import { HistorySummaryMessage } from '~/lib/types/history';

export const submitQuestionAnswer: ServerAction<
  typeof submitQuestionAnswerSchema
> = async (_, formData) => {
  const session = await auth();
  if (!session.isAuthenticated) {
    return {
      validationErrors: null,
      error: 'User must be authenticated to perform this action',
      message: null,
    };
  }

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

  const validatedForm = submitQuestionAnswerSchema.safeParse(formatedFormData);
  if (!validatedForm.success) {
    return {
      validationErrors: validatedForm.error.flatten().fieldErrors,
      error: null,
      message: null,
    };
  }

  let historyId;
  try {
    const topic = await database.topic.findUnique({
      select: { title: true },
      where: { id: validatedForm.data.topic },
    });

    if (topic === null) {
      return {
        validationErrors: null,
        error: 'Topic not found',
        message: null,
      };
    }

    const questions = await database.question.findMany({
      where: {
        topicId: validatedForm.data.topic,
        topic: { subject: { userId: session.user.id } },
      },
      include: { options: true },
    });

    if (validatedForm.data.answers.length !== questions.length) {
      return {
        validationErrors: null,
        error: 'Please answer all questions',
        message: null,
      };
    }

    let numberOfCorrectQuestion = 0;
    for (const question of questions) {
      const answer = validatedForm.data.answers.find(
        (answer) => answer.question === question.id
      );

      if (!answer) continue;

      const correctOptionId = question.options.find(
        (option) => option.isCorrect
      )?.id;
      if (answer.option === correctOptionId) {
        numberOfCorrectQuestion++;
      }
    }

    const history = await database.history.create({
      select: { id: true },
      data: {
        topicId: validatedForm.data.topic,
        score: numberOfCorrectQuestion,
        status: HistoryStatus.PENDING,
        choices: {
          createMany: {
            data: validatedForm.data.answers.map((answer) => ({
              questionId: answer.question,
              optionId: answer.option,
            })),
          },
        },
      },
    });

    const message: HistorySummaryMessage = {
      topic: {
        title: topic.title,
      },
      history: {
        id: history.id,
      },
      questions: questions.map((question) => {
        return {
          id: question.id,
          statement: question.statement,
          options: question.options.map((option) => {
            const answer = validatedForm.data.answers.find(
              (answer) => answer.question === question.id
            )!;
            return {
              id: option.id,
              statement: option.statement,
              description: option.description,
              isCorrect: option.isCorrect,
              isChosen: option.id === answer.option,
            };
          }),
        };
      }),
    };

    try {
      await historySummaryQueue.publish(message);
      historyId = history.id;
    } catch (error) {
      await database.history.delete({ where: { id: history.id } });
      throw error;
    }
  } catch (error) {
    console.error(error);
    return {
      validationErrors: null,
      error: 'Failed to submit answers',
      message: null,
    };
  }

  redirect(`/topics/${validatedForm.data.topic}/histories/${historyId}`);
};
