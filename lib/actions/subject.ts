'use server';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { createSubjectSchema } from '~/lib/schema/subject';

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

  if (!validatedForm.success) {
    return {
      status: 'ERROR',
      error: validatedForm.error.errors[0].message,
      payload: null,
    };
  }

  // TODO: store document into blob storage
  try {
    await database.subject.create({
      data: {
        userId: session.user.id,
        title: validatedForm.data.title,
        description: validatedForm.data.description,
        rawFile: 'NOT_IMPLEMENTED',
      },
    });
    // TODO: store vector of the document into documents table
  } catch (error) {
    console.error(error);
    return {
      status: 'ERROR',
      error: 'Fail to store new subject',
      payload: null,
    };
  }

  return { status: 'SUCCESS', error: null, payload: null };
}
