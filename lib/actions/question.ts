'use server';

import { redirect } from 'next/navigation';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { submitQuestionAnswerSchema } from '~/lib/schema/question';
import { ServerAction } from '~/lib/types/action';

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

    const correctOptionId = question.options.find((option) => option.isCorrect)
      ?.id;
    if (answer.option === correctOptionId) {
      numberOfCorrectQuestion++;
    }
  }

  const history = await database.history.create({
    select: { id: true },
    data: {
      topicId: validatedForm.data.topic,
      score: numberOfCorrectQuestion,
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

  redirect(`/topics/${validatedForm.data.topic}/histories/${history.id}`);
};
