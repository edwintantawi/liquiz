import { PDFDocument } from 'pdf-lib';
import { z } from 'zod';

export const MAX_FILE_SIZE = 30;
export const MAX_FILE_PAGES = 1_000;

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
    .refine((file) => file.size <= MAX_FILE_SIZE_IN_BYTES, {
      message: `Document size must be ${MAX_FILE_SIZE}MB or smaller.`,
    })
    .refine(
      async (file) => {
        const pdf = await PDFDocument.load(await file.arrayBuffer());
        const numberOfPages = pdf.getPageCount();
        return numberOfPages <= MAX_FILE_PAGES;
      },
      {
        message: `Document must be ${MAX_FILE_PAGES} pages or smaller.`,
      }
    ),
});

export const deleteSubjectSchema = z.object({
  subject: z
    .string({ required_error: 'Subject is required' })
    .min(1, { message: 'Subject is required' }),
});

export const updateSubjectSchema = createSubjectSchema
  .pick({
    title: true,
    description: true,
  })
  .and(
    z.object({
      subject: z
        .string({ required_error: 'Subject is required' })
        .min(1, { message: 'Subject is required' }),
    })
  );
