import { z } from 'zod';

export const createTopicSchema = z.object({
  subject: z
    .string({ required_error: 'Subject is required' })
    .min(1, { message: 'Subject is required' }),
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, { message: 'Title is required' })
    .max(64, { message: 'Maximum title length is 64 characters' }),
  numberOfQuestions: z.coerce
    .number({
      required_error: 'Number of questions is required',
      invalid_type_error: 'Number of questions must be a number',
    })
    .min(1, { message: 'Number of questions must be at least 1' }),
});
