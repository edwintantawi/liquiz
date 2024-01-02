'use server';

import { redirect } from 'next/navigation';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { loadPdfDocument, splitter, vectorStore } from '~/lib/langchain';
import { createSubjectSchema } from '~/lib/schema/subject';
import { subjectFileStorage } from '~/lib/storage';
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
  let fileStorageId;
  try {
    const docs = await loadPdfDocument(validatedForm.data.document);
    const chunks = await splitter.splitDocuments(docs);

    fileStorageId = await subjectFileStorage.store(validatedForm.data.document);

    const { id } = await database.subject.create({
      select: { id: true },
      data: {
        userId: session.user.id,
        title: validatedForm.data.title,
        description: validatedForm.data.description,
        file: fileStorageId,
      },
    });

    try {
      const documents = chunks.map((content) => {
        return database.document.create({
          data: {
            subjectId: id,
            content: content.pageContent.replaceAll('\u0000', ''),
            metadata: content.metadata,
          },
        });
      });
      const models = await database.$transaction(documents);
      await vectorStore.addModels(models);

      subjectId = id;
    } catch (error) {
      await database.subject.delete({ where: { id } });
      throw error;
    }
  } catch (error) {
    await subjectFileStorage.delete(fileStorageId);

    console.error(error);
    return {
      validationErrors: null,
      error: 'Failed to store new subject',
      message: null,
    };
  }

  redirect(`/subjects/${subjectId}`);
};
