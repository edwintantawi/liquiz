import { StructuredOutputParser } from 'langchain/output_parsers';
import z from 'zod';

export const outputParser = StructuredOutputParser.fromZodSchema(
  z.array(
    z
      .object({
        statement: z
          .string()
          .describe(
            'Statement of questions must be unique each other, and must be clear and descriptive and can contain an story or context to make the question more interesting'
          ),
        options: z
          .array(
            z.object({
              statement: z.string().describe('Clear and descriptive answer'),
              isCorrect: z
                .boolean()
                .describe('Is this option correct base on question?'),
              description: z
                .string()
                .describe(
                  'Provide explanations and reasons why this option is correct or incorrect by providing relevant information'
                ),
            })
          )
          .describe(
            'List of 4 possible options or 2 posible option if type of the question is yes/no question with only 1 option can be true and other 3 answers are false'
          ),
      })
      .describe('List of questions')
  )
);

export const historySummaryOutputParser = StructuredOutputParser.fromZodSchema(
  z.object({
    feedbacks: z.array(
      z.string({ description: 'Feedback result per pargraph' }),
      { description: 'List of feedback paragraphs' }
    ),
    suggestions: z.array(z.string({ description: 'Suggestions result' })),
  })
);
