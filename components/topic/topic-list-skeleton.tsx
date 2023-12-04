import * as React from 'react';

import { TopicItemSkeleton } from '~/components/topic';

interface TopicListSkeletonProps {
  count: number;
}

export function TopicListSkeleton({ count }: TopicListSkeletonProps) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, index) => {
        return (
          <li key={index}>
            <TopicItemSkeleton />
          </li>
        );
      })}
    </ul>
  );
}
