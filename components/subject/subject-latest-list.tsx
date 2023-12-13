import * as React from 'react';

import { CreateSubject } from '~/components/subject/create-subject';
import { SubjectItem } from '~/components/subject/subject-item';
import { getLatestSubjects } from '~/lib/queries/subject';

export async function SubjectLatestList() {
  const latestSubject = await getLatestSubjects({ limit: 5 });

  return (
    <ul className="grid grid-cols-2 gap-2">
      {latestSubject.map((subject) => {
        return (
          <li key={subject.id}>
            <SubjectItem
              id={subject.id}
              title={subject.title}
              description={subject.description}
              numberOfTopics={subject.numberOfTopics}
              colorCode={subject.colorCode}
            />
          </li>
        );
      })}
      <li>
        <CreateSubject />
      </li>
    </ul>
  );
}
