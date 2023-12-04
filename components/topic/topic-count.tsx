import * as React from 'react';

import { Icons } from '~/components/icons';
import { Skeleton } from '~/components/ui/skeleton';
import { getTopicsCount } from '~/lib/queries/topics';

export async function TopicCount() {
  const count = await getTopicsCount();

  return (
    <div className="flex items-center gap-1 rounded-md border p-3">
      <Icons.Topic />
      <h2 className="flex items-center gap-1">
        <span className="text-lg font-bold">{count}</span>
        <span className="text-sm text-muted-foreground">
          {count <= 1 ? 'Topic' : 'Topics'}
        </span>
      </h2>
    </div>
  );
}

export function TopicCountSkeleton() {
  return (
    <div className="flex items-center gap-1 rounded-md border p-3">
      <Icons.Topic />
      <div className="flex items-center gap-1">
        <Skeleton className="h-7 w-8" />
        <span className="text-sm text-muted-foreground">Topics</span>
      </div>
    </div>
  );
}
