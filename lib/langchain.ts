import { Document, Prisma } from '@prisma/client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';

import { database } from '~/lib/database';
import { env } from '~/lib/env.mjs';

export const llm = new OpenAI({
  // MODEL            : gpt-3.5-turbo-1106
  // CONTEXT WINDOW   : 16,385 tokens
  // MAX OUTPUT       : 4,096 tokens
  modelName: 'gpt-3.5-turbo-1106',
  openAIApiKey: env.OPENAI_API_KEY,
  temperature: 1,
});

export const vectorStore = PrismaVectorStore.withModel<Document>(
  database
).create(new OpenAIEmbeddings(), {
  prisma: Prisma,
  tableName: 'documents' as 'Document',
  vectorColumnName: 'vector',
  columns: {
    id: PrismaVectorStore.IdColumn,
    content: PrismaVectorStore.ContentColumn,
  },
});

export async function loadPdfDocument(file: Blob | string) {
  const loader = new PDFLoader(file);
  const docs = await loader.load();
  return docs;
}

export const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 64,
});
