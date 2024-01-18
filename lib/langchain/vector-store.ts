import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document, Prisma } from '@prisma/client';

import { database } from '~/lib/database';

export function createVectorStore() {
  return PrismaVectorStore.withModel<Document>(database).create(
    new OpenAIEmbeddings(),
    {
      prisma: Prisma,
      tableName: 'documents' as 'Document',
      vectorColumnName: 'vector',
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    }
  );
}
