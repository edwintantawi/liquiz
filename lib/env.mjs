// Ref: https://github.com/c-ehrlich/docker-next-auth/blob/main/src/env.mjs

import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const server = z.object({
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL_NAME: z.string(),
  GCP_SUBJECT_FILE_BUCKET_NAME: z.string(),
  GCP_PUBSUB_TOPIC_NAME: z.string(),
  GCP_PUBSUB_VERIFICATION_TOKEN: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const client = z.object({
  // NEXT_PUBLIC_VAR: z.string(),
});

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
    ? merged.safeParse(process.env) // on server we can validate all env vars
    : client.safeParse(process.env); // on client we can only validate the ones that are exposed

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
  env = process.env;
}

export { env };
