import * as React from 'react';

import { CreateSubjectButton } from '~/components/subject/create-subject-button';
import { SubjectItem } from '~/components/subject/subject-item';
import { getAllSubjects } from '~/lib/queries/subject';
import { cn } from '~/lib/utils';

export async function SubjectList() {
  const subjects = await getAllSubjects();

  return (
    <ul className="grid grid-cols-2 gap-2">
      {subjects.map((subject) => {
        return (
          <li key={subject.id}>
            <SubjectItem
              id={subject.id}
              title={subject.title}
              description={subject.description}
              numberOfTopics={subject.numberOfTopics}
              color={subject.color}
            />
          </li>
        );
      })}
      <li className={cn({ 'col-span-2': subjects.length % 2 === 0 })}>
        <CreateSubjectButton />
      </li>
    </ul>
  );
}
