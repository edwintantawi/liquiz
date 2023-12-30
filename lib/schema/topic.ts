import { z } from 'zod';

export const createTopicSchema = z.object({
  subject: z
    .string({ required_error: 'Subject is required' })
    .min(1, { message: 'Subject is required' }),
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, { message: 'Title is required' })
    .max(64, { message: 'Maximum title length is 64 characters' }),
});

export const submitTopicQuestionSchema = z.object({
  topic: z
    .string({ required_error: 'Topic is required' })
    .min(1, { message: 'Topic is required' }),
  answers: z.array(
    z.object({
      question: z.string({ required_error: 'Question is required' }),
      option: z.string({ required_error: 'Option required' }),
    })
  ),
});
