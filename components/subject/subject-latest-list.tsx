import * as React from 'react';

import { Icons } from '~/components/icons';
import { SubjectItem } from '~/components/subject';
import { Button } from '~/components/ui/button';
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
        <Button
          variant="ghost"
          className="flex h-full w-full border-spacing-2 flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed p-3 font-normal text-slate-400 hover:ring-2 hover:ring-ring hover:ring-offset-2"
        >
          <Icons.AddSubject size={30} strokeWidth={1.5} />
          Create new subject
        </Button>
      </li>
    </ul>
  );
}
