import { database } from '~/lib/database';

const MAX_NUMBER_OF_QUESTIONS = 30;

export async function getMaxNumberOfQuestionsBySubjectId(subjectId?: string) {
  const numberOfDocuments = await database.document.count({
    where: { subjectId: subjectId ?? '__NO_SUBJECT_ID__' },
  });

  return numberOfDocuments > MAX_NUMBER_OF_QUESTIONS
    ? MAX_NUMBER_OF_QUESTIONS
    : numberOfDocuments;
}
