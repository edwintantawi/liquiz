import * as React from 'react';
import Link from 'next/link';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/lib/utils';

interface TopicItemProps {
  id: string;
  title: string;
  subject: {
    id: string;
    title: string;
    color: string;
  };
}

export function TopicItem({ id, title, subject }: TopicItemProps) {
  return (
    <article
      key={id}
      className="relative grid grid-cols-[auto,1fr,auto] items-center gap-2 rounded-md border p-2 hover:ring-2 hover:ring-ring hover:ring-offset-2"
    >
      <div className={cn('size-10 rounded-sm', subject.color)} />
      <header>
        <p className="text-xs text-muted-foreground">{subject.title}</p>
        <h3 className="truncate text-sm font-semibold">
          <Link
            href={`/topics/${id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </h3>
      </header>

      <Button asChild variant="outline" size="icon" className="z-10">
        <Link href={`/topics/${id}/histories`}>
          <Icons.History size={20} />
          <span className="sr-only">View {title} topic history</span>
        </Link>
      </Button>
    </article>
  );
}

export function TopicItemSkeleton() {
  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 rounded-md border p-2">
      <Skeleton className="size-10" />
      <div>
        <Skeleton className="mb-1 h-3 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <Skeleton className="size-10" />
    </div>
  );
}
