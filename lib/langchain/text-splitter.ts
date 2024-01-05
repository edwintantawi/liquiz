import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 64,
});
