import { delay } from '~/lib/utils';

export async function getTopicsCount() {
  // TODO: fetch data from database
  await delay(6000);
  return 23;
}

type Topic = {
  id: string;
  title: string;
  score: number;
  subject: {
    id: string;
    title: string;
    colorCode: string;
  };
};

export async function getLatestTopics({
  limit,
}: {
  limit: number;
}): Promise<Topic[]> {
  // TODO: fetch data from database
  await delay(4000);

  return [
    {
      id: '1',
      title: 'Central Processing Unit',
      score: 80,
      subject: {
        id: '1',
        title: 'Computer Science',
        colorCode: '#ED3030',
      },
    },
    {
      id: '2',
      title: 'HTTP Protocol',
      score: 90,
      subject: {
        id: '1',
        title: 'Computer Science',
        colorCode: '#ED3030',
      },
    },
    {
      id: '3',
      title: 'Browser APIs',
      score: 82,
      subject: {
        id: '5',
        title: 'Javascript',
        colorCode: '#EE209B',
      },
    },
    {
      id: '4',
      title: 'State Law',
      score: 20,
      subject: {
        id: '3',
        title: 'Citizenship',
        colorCode: '#3ED0B6',
      },
    },
  ].slice(0, limit);
}
