import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

export async function loadPdfDocument(file: Blob | string) {
  const loader = new PDFLoader(file, {
    parsedItemSeparator: ' ',
  });
  const docs = await loader.load();
  return docs;
}
