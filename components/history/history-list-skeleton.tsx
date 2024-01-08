import * as React from 'react';

import { HistoryItemSkeleton } from '~/components/history/history-item';

interface HistoryListSkeletonProps {
  count: number;
}

export function HistoryListSkeleton({ count }: HistoryListSkeletonProps) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, index) => {
        return (
          <li key={index}>
            <HistoryItemSkeleton />
          </li>
        );
      })}
    </ul>
  );
}
