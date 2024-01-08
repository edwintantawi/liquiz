import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    GOOGLE_OAUTH_CLIENT_ID: z.string(),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
    OPENAI_API_KEY: z.string(),
    GCP_SUBJECT_FILE_BUCKET_NAME: z.string(),
    GCP_PUBSUB_TOPIC_NAME: z.string(),
    GCP_PUBSUB_VERIFICATION_TOKEN: z.string(),
  },
  runtimeEnv: process.env,
});
