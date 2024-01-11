import { z } from 'zod';

export const submitQuestionAnswerSchema = z.object({
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
