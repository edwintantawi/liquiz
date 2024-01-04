import { env } from '~/lib/env.mjs';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const token = searchParams.get('token');

  if (token !== env.GCP_PUBSUB_VERIFICATION_TOKEN) {
    return new Response('UNAUTHORIZED', { status: 401 });
  }

  const body = await request.json();
  const payload = Buffer.from(body.message.data, 'base64').toString();
  console.log({ payload });

  return new Response(undefined, { status: 200 });
}
