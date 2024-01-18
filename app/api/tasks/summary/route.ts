import { PromptTemplate } from '@langchain/core/prompts';
import { HistoryStatus, RetrievalTimeType } from '@prisma/client';
import { LLMChain } from 'langchain/chains';
import { OutputFixingParser } from 'langchain/output_parsers';
import { z } from 'zod';

import { database } from '~/lib/database';
import { env } from '~/lib/env.mjs';
import { createLLM } from '~/lib/langchain/llm';
import { historySummaryOutputParser } from '~/lib/langchain/output-parser';
import { createHistorySummaryPrompt } from '~/lib/langchain/prompt-template';
import { HistorySummaryMessage } from '~/lib/types/history';

type Records = z.infer<typeof historySummaryOutputParser.schema>;
type Result = {
  records: Records;
};

export async function POST(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const token = searchParams.get('token');

  if (token !== env.GCP_PUBSUB_VERIFICATION_TOKEN) {
    return new Response('UNAUTHORIZED', { status: 401 });
  }

  try {
    const t0 = performance.now();

    const llm = createLLM();
    const body = await request.json();
    const payload = JSON.parse(
      Buffer.from(body.message.data, 'base64').toString()
    ) as HistorySummaryMessage;

    const questions = payload.questions.map((q, index) => {
      return `
${index + 1}. ${q.statement}
  ${q.options
    .map((o) => {
      return `- ${o.statement} ${
        o.isCorrect ? '(correct answer)' : '(wrong answer)'
      } ${o.isChosen ? '(user chosen)' : ''} (${o.description})`;
    })
    .join('\n\t')}`;
    });

    const outputFixingParser = OutputFixingParser.fromLLM(
      llm,
      historySummaryOutputParser
    );

    const prompt = new PromptTemplate({
      template: createHistorySummaryPrompt,
      inputVariables: ['topic', 'questions'],
    });

    const answerFormattingChain = new LLMChain({
      llm,
      prompt,
      outputKey: 'records',
      outputParser: outputFixingParser,
    });

    const result = (await answerFormattingChain.call({
      topic: payload.topic.title,
      questions: questions,
    })) as Result;

    await database.history.update({
      data: {
        feedbacks: result.records.feedbacks,
        suggestions: result.records.suggestions,
        status: HistoryStatus.COMPLETED,
      },
      where: { id: payload.history.id },
    });

    const t1 = performance.now();
    const retrievalTime = t1 - t0;
    await database.retrievalTime.create({
      data: {
        type: RetrievalTimeType.HISTORY,
        targetId: payload.history.id,
        duration: retrievalTime,
      },
    });

    return new Response(undefined, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(undefined, { status: 500 });
  }
}
