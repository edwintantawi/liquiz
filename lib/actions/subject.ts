'use server';

import { auth } from '~/lib/auth';
import { createSubjectSchema } from '~/lib/schema/subject';
import { delay } from '~/lib/utils';

export async function createSubject(formData: FormData) {
  const validatedForm = createSubjectSchema.safeParse(
    Object.fromEntries(formData)
  );
  const session = await auth();

  if (!session.isAuthenticated) {
    return {
      status: 'ERROR',
      error: 'Unauthenticated user',
      payload: null,
    };
  }

  await delay(5000);

  if (!validatedForm.success) {
    return {
      status: 'ERROR',
      error: validatedForm.error.errors,
      payload: null,
    };
  }

  return { status: 'SUCCESS', error: null, payload: null };
}
