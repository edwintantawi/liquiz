'use server';

import { redirect } from 'next/navigation';

import { RetrievalTimeType } from '@prisma/client';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { loadPdfDocument } from '~/lib/langchain/document-loader';
import { splitter } from '~/lib/langchain/text-splitter';
import { createVectorStore } from '~/lib/langchain/vector-store';
import {
  createSubjectSchema,
  deleteSubjectSchema,
  updateSubjectSchema,
} from '~/lib/schema/subject';
import { subjectFileStorage } from '~/lib/storage';
import { ServerAction } from '~/lib/types/action';

const vectorStore = createVectorStore();

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
    fileStorageId = await subjectFileStorage.store(validatedForm.data.document);

    const t0 = performance.now();
    const docs = await loadPdfDocument(validatedForm.data.document);
    const chunks = await splitter.splitDocuments(docs);

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
            content: content.pageContent
              .replaceAll('\u0000', '')
              .replaceAll('  ', ' '),
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

    const t1 = performance.now();
    const retrievalTime = t1 - t0;
    await database.retrievalTime.create({
      data: {
        type: RetrievalTimeType.SUBJECT,
        targetId: subjectId,
        duration: retrievalTime,
      },
    });
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

export const deleteSubject: ServerAction<typeof deleteSubjectSchema> = async (
  _,
  formData
) => {
  const validatedForm = deleteSubjectSchema.safeParse(
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

  try {
    const subject = await database.subject.findUnique({
      where: { id: validatedForm.data.subject },
      select: { userId: true, file: true },
    });

    if (subject === null) {
      return {
        validationErrors: null,
        error: 'Subject not found',
        message: null,
      };
    }

    if (session.user.id !== subject.userId) {
      return {
        validationErrors: null,
        error: 'User must be the owner of the subject to perform this action',
        message: null,
      };
    }

    await database.subject.delete({
      where: { id: validatedForm.data.subject, userId: session.user.id },
    });

    await subjectFileStorage.delete(subject.file);
  } catch (error) {
    console.error(error);
    return {
      validationErrors: null,
      error: 'Failed to delete subject',
      message: null,
    };
  }

  redirect('/subjects');
};

export const updateSubject: ServerAction<typeof updateSubjectSchema> = async (
  _,
  formData
) => {
  const validatedForm = updateSubjectSchema.safeParse(
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

  const subject = await database.subject.findUnique({
    where: { id: validatedForm.data.subject },
    select: { userId: true },
  });

  if (subject === null) {
    return {
      validationErrors: null,
      error: 'Subject not found',
      message: null,
    };
  }

  if (session.user.id !== subject.userId) {
    return {
      validationErrors: null,
      error: 'User must be the owner of the subject to perform this action',
      message: null,
    };
  }

  try {
    await database.subject.update({
      data: {
        title: validatedForm.data.title,
        description: validatedForm.data.description,
      },
      where: { id: validatedForm.data.subject },
    });
  } catch (error) {
    console.error(error);
    return {
      validationErrors: null,
      error: 'Failed to update the subject',
      message: null,
    };
  }

  redirect(`/subjects/${validatedForm.data.subject}`);
};
