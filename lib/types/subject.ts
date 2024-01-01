import { Subject as SubjectSchema } from '@prisma/client';

export interface Subject extends SubjectSchema {
  numberOfTopics: number;
  color: string;
}
