import { database } from '~/lib/database';

export async function getMaxNumberOfQuestionsBySubjectId(subjectId?: string) {
  return await database.document.count({
    where: { subjectId: subjectId ?? '__NO_SUBJECT_ID__' },
  });
}
