import { Document, Prisma } from '@prisma/client';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';

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
