import * as React from 'react';
import Link from 'next/link';

import { Skeleton } from '~/components/ui/skeleton';

interface SubjectItemProps {
  id: string;
  title: string;
  description: string;
  numberOfTopics: number;
  colorCode: string;
}

export function SubjectItem({
  id,
  title,
  description,
  numberOfTopics,
  colorCode,
}: SubjectItemProps) {
  return (
    <article className="relative overflow-hidden rounded-md border hover:ring-2 hover:ring-ring hover:ring-offset-2">
      <div
        className="flex aspect-[16/8] items-end justify-end p-2"
        style={{
          backgroundColor: colorCode,
        }}
      >
        <span className="rounded-full border bg-muted px-3 py-0.5 text-[0.60rem] text-muted-foreground">
          {numberOfTopics} {numberOfTopics <= 1 ? 'Topic' : 'Topics'}
        </span>
      </div>
      <header className="p-2">
        <h3 className="truncate text-sm font-semibold">
          <Link
            href={`/subjects/${id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </h3>
        <p className="truncate text-xs font-light text-muted-foreground">
          {description}
        </p>
      </header>
    </article>
  );
}

export function SubjectItemSkeleton() {
  return (
    <div className="rounded-md border">
      <Skeleton className="aspect-[16/8]" />
      <div className="p-2">
        <Skeleton className="mb-1 h-5 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
