import { database } from '~/lib/database';
import { env } from '~/lib/env.mjs';

const MAX_NUMBER_OF_QUESTIONS = env.MAX_NUMBER_OF_QUESTIONS;

export async function getMaxNumberOfQuestionsBySubjectId(subjectId?: string) {
  const numberOfDocuments = await database.document.count({
    where: { subjectId: subjectId ?? '__NO_SUBJECT_ID__' },
  });

  return numberOfDocuments > MAX_NUMBER_OF_QUESTIONS
    ? MAX_NUMBER_OF_QUESTIONS
    : numberOfDocuments;
}
