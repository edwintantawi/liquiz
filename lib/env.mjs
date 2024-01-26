// Ref: https://github.com/c-ehrlich/docker-next-auth/blob/main/src/env.mjs

import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const server = z.object({
  BASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL_NAME: z.string(),
  GCP_SUBJECT_FILE_BUCKET_NAME: z.string(),
  GCP_PUBSUB_TOPIC_NAME: z.string(),
  GCP_PUBSUB_HISTORY_SUMMARY_TOPIC_NAME: z.string(),
  GCP_PUBSUB_VERIFICATION_TOKEN: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const client = z.object({
  NEXT_PUBLIC_MAX_NUMBER_OF_QUESTIONS: z.coerce.number().default(0),
  NEXT_PUBLIC_MAX_NUMBER_OF_PAGES: z.coerce.number().default(0),
  NEXT_PUBLIC_MAX_FILE_SIZE: z.coerce.number().default(0),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * edge runtimes (e.g. middlewares) or client-side so we need to destruct manually.
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  BASE_URL: process.env.BASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL_NAME: process.env.OPENAI_MODEL_NAME,
  GCP_SUBJECT_FILE_BUCKET_NAME: process.env.GCP_SUBJECT_FILE_BUCKET_NAME,
  GCP_PUBSUB_TOPIC_NAME: process.env.GCP_PUBSUB_TOPIC_NAME,
  GCP_PUBSUB_HISTORY_SUMMARY_TOPIC_NAME:
    process.env.GCP_PUBSUB_HISTORY_SUMMARY_TOPIC_NAME,
  GCP_PUBSUB_VERIFICATION_TOKEN: process.env.GCP_PUBSUB_VERIFICATION_TOKEN,

  NEXT_PUBLIC_MAX_NUMBER_OF_QUESTIONS:
    process.env.NEXT_PUBLIC_MAX_NUMBER_OF_QUESTIONS,
  NEXT_PUBLIC_MAX_NUMBER_OF_PAGES: process.env.NEXT_PUBLIC_MAX_NUMBER_OF_PAGES,
  NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE,
};

const merged = server.merge(client);
/** @type z.infer<merged>
 *  @ts-ignore - can't type this properly in jsdoc */
let env;

if (!process.env.SKIP_ENV_VALIDATION) {
  const formatErrors = (
    /** @type {z.ZodFormattedError<Map<string,string>,string>} */
    errors
  ) =>
    Object.entries(errors)
      .map(([name, value]) => {
        if (value && '_errors' in value)
          return `${name}: ${value._errors.join(', ')}\n`;
      })
      .filter(Boolean);

  const isServer = typeof window === 'undefined';

  const parsed = isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv); // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:\n',
      ...formatErrors(parsed.error.format())
    );
    throw new Error('Invalid environment variables');
  }

  // eslint-disable-next-line no-undef
  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      return target[prop];
    },
  });
} else {
  env = processEnv;
}

export { env };
