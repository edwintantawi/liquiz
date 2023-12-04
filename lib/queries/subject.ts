import { delay } from '~/lib/utils';

export async function getSubjectsCount() {
  // TODO: fetch data from database
  await delay(5000);
  return 6;
}

type Subject = {
  id: string;
  title: string;
  description: string;
  numberOfTopics: number;
  colorCode: string;
};

export async function getLatestSubjects({
  limit,
}: {
  limit: number;
}): Promise<Subject[]> {
  // TODO: fetch data from database
  await delay(3000);

  return [
    {
      id: '1',
      title: 'Computer Science',
      description: '3rd semester courses',
      colorCode: '#ED3030',
      numberOfTopics: 8,
    },
    {
      id: '2',
      title: 'Quantum Mathematics',
      description: 'Quantum mathematics book',
      colorCode: '#2E5ED9',
      numberOfTopics: 2,
    },
    {
      id: '3',
      title: 'Citizenship',
      description: '7th grade citizenship',
      colorCode: '#3ED0B6',
      numberOfTopics: 4,
    },
    {
      id: '4',
      title: 'Physical Education',
      description: 'Physical education from academic book',
      colorCode: '#3CAE14',
      numberOfTopics: 6,
    },
    {
      id: '5',
      title: 'Javascript',
      description: "From the book you don't know js",
      colorCode: '#EE209B',
      numberOfTopics: 1,
    },
  ].slice(0, limit);
}
