import { database } from '~/lib/database';
import { env } from '~/lib/env.mjs';

const MAX_NUMBER_OF_QUESTIONS = env.NEXT_PUBLIC_MAX_NUMBER_OF_QUESTIONS;

export async function getMaxNumberOfQuestionsBySubjectId(subjectId?: string) {
  const numberOfDocuments = await database.document.count({
    where: { subjectId: subjectId ?? '__NO_SUBJECT_ID__' },
  });

  if (MAX_NUMBER_OF_QUESTIONS === 0) return numberOfDocuments;

  return numberOfDocuments > MAX_NUMBER_OF_QUESTIONS
    ? MAX_NUMBER_OF_QUESTIONS
    : numberOfDocuments;
}
