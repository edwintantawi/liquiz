import { delay } from '~/lib/utils';

export async function getSubjectsCount() {
  // TODO: fetch data from database
  await delay(5000);
  return 6;
}
