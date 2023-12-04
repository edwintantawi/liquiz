import * as React from 'react';

import { Icons } from '~/components/icons';
import { Skeleton } from '~/components/ui/skeleton';
import { getSubjectsCount } from '~/lib/queries/subject';

export async function SubjectCount() {
  const count = await getSubjectsCount();

  return (
    <div className="flex items-center gap-1 rounded-md border p-3">
      <Icons.Subject />
      <h2 className="flex items-center gap-1">
        <span className="text-lg font-bold">{count}</span>
        <span className="text-sm text-muted-foreground">
          {count <= 1 ? 'Subject' : 'Subjects'}
        </span>
      </h2>
    </div>
  );
}

export function SubjectCountSkeleton() {
  return (
    <div className="flex items-center gap-1 rounded-md border p-3">
      <Icons.Subject />
      <div className="flex items-center gap-1">
        <Skeleton className="h-7 w-8" />
        <span className="text-sm text-muted-foreground">Subjects</span>
      </div>
    </div>
  );
}
