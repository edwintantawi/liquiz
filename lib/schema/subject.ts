import { z } from 'zod';

export const MAX_FILE_SIZE = 30;

const TO_BYTES = 20;
const MAX_FILE_SIZE_IN_BYTES = MAX_FILE_SIZE << TO_BYTES;

export const createSubjectSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, { message: 'Title is required' })
    .max(64, { message: 'Maximum title length is 64 characters' }),
  description: z
    .string()
    .max(100, { message: 'Maximum description length is 100 characters' }),
  document: z
    .custom<File>()
    .refine((file) => file.name !== '' && file.size !== 0, {
      message: 'Document is required',
    })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Document must be in .pdf format',
    })
    .refine((file) => file.size < MAX_FILE_SIZE_IN_BYTES, {
      message: `Document size must be ${MAX_FILE_SIZE}MB or smaller.`,
    }),
});
