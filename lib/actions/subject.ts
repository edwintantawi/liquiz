'use server';

import { redirect } from 'next/navigation';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { loadPdfDocument, splitter, vectorStore } from '~/lib/langchain';
import { createSubjectSchema } from '~/lib/schema/subject';
import { ServerAction } from '~/lib/types/action';

export const createSubject: ServerAction<typeof createSubjectSchema> = async (
  _,
  formData
) => {
  const validatedForm = createSubjectSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!validatedForm.success) {
    return {
      validationErrors: validatedForm.error.flatten().fieldErrors,
      error: null,
      message: null,
    };
  }

  const session = await auth();
  if (!session.isAuthenticated) {
    return {
      validationErrors: null,
      error: 'User must be authenticated to perform this action',
      message: null,
    };
  }

  let subjectId;
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
        rawFile: validatedForm.data.document.name,
      },
    });
    subjectId = id;

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
      validationErrors: null,
      error: 'Fail to store new subject',
      message: null,
    };
  }

  redirect(`/subjects/${subjectId}`);
};
