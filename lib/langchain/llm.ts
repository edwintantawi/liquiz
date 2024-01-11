import { OpenAI } from 'langchain/llms/openai';

import { env } from '~/lib/env.mjs';

export const llm = new OpenAI({
  // MODEL            : gpt-3.5-turbo-1106
  // CONTEXT WINDOW   : 16,385 tokens
  // MAX OUTPUT       : 4,096 tokens

  // MODEL            : gpt-4-1106-preview
  // CONTEXT WINDOW   : 128,000 tokens
  // MAX OUTPUT       : 4,096 tokens
  modelName: 'gpt-3.5-turbo-1106',
  openAIApiKey: env.OPENAI_API_KEY,
  temperature: 1,
  verbose: false,
});
