import { z } from 'zod';

export const createSubjectSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, { message: 'Title is required' })
    .max(64, { message: 'Maximum title length is 64 characters' }),
  description: z
    .string()
    .max(100, { message: 'Maximum description length is 100 characters' }),
  document: z
    .custom<File>((data) => data !== undefined, {
      message: 'Document is required',
    })
    .refine((file) => file?.type === 'application/pdf', {
      message: 'Document must be in pdf format',
    }),
});
