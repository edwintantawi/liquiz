import { delay } from '~/lib/utils';

export async function POST(request: Request) {
  const body = await request.json();
  await delay(5000);
  console.log(Buffer.from(body.message.data, 'base64').toString());
  return new Response(undefined, { status: 200 });
}
