import * as React from 'react';
import Link from 'next/link';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/lib/utils';

interface HistoryItemProps {
  id: string;
  topicId: string;
  score: number;
  createdAt: Date;
}

export function HistoryItem({
  id,
  score,
  createdAt,
  topicId,
}: HistoryItemProps) {
  const title = createdAt.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article
      key={id}
      className="relative grid grid-cols-[auto,1fr,auto] items-center gap-2 rounded-md border p-2 hover:ring-2 hover:ring-ring hover:ring-offset-2"
    >
      <div
        className={cn(
          'grid h-10 w-10 place-items-center rounded-sm text-xs font-semibold text-white',
          {
            'bg-green-500': score >= 75,
            'bg-yellow-500': score >= 50 && score < 75,
            'bg-red-500': score < 50,
          }
        )}
      >
        {score}%
      </div>
      <header>
        <h3 className="truncate text-xs font-semibold md:text-sm">
          <Link
            href={`/topics/${topicId}/histories/${id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </h3>
      </header>

      <Button asChild variant="outline" size="icon" className="z-10">
        <Link href={`/topics/${topicId}/histories/${id}`}>
          <Icons.Next size={20} />
          <span className="sr-only">View history on {title}</span>
        </Link>
      </Button>
    </article>
  );
}

export function HistoryItemSkeleton() {
  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 rounded-md border p-2">
      <Skeleton className="h-10 w-10" />
      <div>
        <Skeleton className="h-5 w-2/3" />
      </div>
      <Skeleton className="h-10 w-10" />
    </div>
  );
}
