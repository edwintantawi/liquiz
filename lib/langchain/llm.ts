import { OpenAI } from '@langchain/openai';

import { env } from '~/lib/env.mjs';

export function createLLM() {
  return new OpenAI({
    // MODEL            : gpt-3.5-turbo-1106
    // CONTEXT WINDOW   : 16,385 tokens
    // MAX OUTPUT       : 4,096 tokens

    // MODEL            : gpt-4-1106-preview
    // CONTEXT WINDOW   : 128,000 tokens
    // MAX OUTPUT       : 4,096 tokens
    modelName: env.OPENAI_MODEL_NAME,
    openAIApiKey: env.OPENAI_API_KEY,
    temperature: 1,
    verbose: false,
  });
}
