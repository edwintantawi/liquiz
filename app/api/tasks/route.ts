import { LLMChain } from 'langchain/chains';
import { OutputFixingParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import { z } from 'zod';

import { database } from '~/lib/database';
import { env } from '~/lib/env.mjs';
import { createLLM } from '~/lib/langchain/llm';
import { outputParser } from '~/lib/langchain/output-parser';
import { createQuestionsPrompt } from '~/lib/langchain/prompt-template';
import { TopicMessage } from '~/lib/types/topic';

type Question = z.infer<typeof outputParser.schema>[number];
type Result = {
  records: Question[];
};

export async function POST(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const token = searchParams.get('token');

  if (token !== env.GCP_PUBSUB_VERIFICATION_TOKEN) {
    return new Response('UNAUTHORIZED', { status: 401 });
  }

  try {
    const llm = createLLM();
    const body = await request.json();
    const payload = JSON.parse(
      Buffer.from(body.message.data, 'base64').toString()
    ) as TopicMessage;

    const outputFixingParser = OutputFixingParser.fromLLM(llm, outputParser);
    const prompt = new PromptTemplate({
      template: createQuestionsPrompt,
      inputVariables: ['topic', 'numberOfQuestions', 'context'],
      partialVariables: {
        format_instructions: outputFixingParser.getFormatInstructions(),
      },
    });
    const answerFormattingChain = new LLMChain({
      llm,
      prompt,
      outputKey: 'records',
      outputParser: outputFixingParser,
    });

    const answerFormatingChain = (await answerFormattingChain.call({
      topic: payload.topic.title,
      numberOfQuestions: payload.topic.numberOfQuestions,
      context: payload.contexts.join('\n\n'),
    })) as Result;

    const questions = answerFormatingChain.records;

    const questionsPromises = questions.map((question) => {
      return database.question.create({
        data: {
          topicId: payload.topic.id,
          statement: question.statement,
          options: {
            createMany: {
              data: question.options.map((option) => ({
                statement: option.statement,
                isCorrect: option.isCorrect,
                description: option.description,
              })),
            },
          },
        },
      });
    });

    await database.$transaction(questionsPromises);

    return new Response(undefined, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(undefined, { status: 500 });
  }
}
