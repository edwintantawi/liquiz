import { delay } from '~/lib/utils';

export async function getTopicsCount() {
  // TODO: fetch data from database
  await delay(6000);
  return 23;
}
