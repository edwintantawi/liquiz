'use server';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { loadPdfDocument, splitter, vectorStore } from '~/lib/langchain';
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

  try {
    const docs = await loadPdfDocument(validatedForm.data.document);
    const chunks = await splitter.splitDocuments(docs);

    // TODO: store pdf file to blob storage, and save the blob id to database

    const { id } = await database.subject.create({
      select: { id: true },
      data: {
        userId: session.user.id,
        title: validatedForm.data.title,
        description: validatedForm.data.description,
        rawFile: 'NOT_IMPLEMENTED',
      },
    });

    await vectorStore.addModels(
      await database.$transaction(
        chunks.map((content) =>
          database.document.create({
            data: {
              subjectId: id,
              content: content.pageContent,
              metadata: content.metadata,
            },
          })
        )
      )
    );
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
