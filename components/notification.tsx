'use client';

import * as React from 'react';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { Operation } from '~/lib/types/operation';
import { cn } from '~/lib/utils';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function Notification() {
  const [open, setOpen] = React.useState<boolean>(false);
  const { data: operations = [] } = useQuery({
    queryKey: ['operations'],
    queryFn: async () => {
      const response = await fetch('/api/fetcher/operations');
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const result = (await response.json()) as Operation[];
      return result;
    },
    refetchInterval: 10_000,
  });

  const numberOfPendingOperation =
    operations?.filter((operation) => operation.status === 'PENDING').length ??
    0;

  const hasPendingOperation = numberOfPendingOperation > 0;

  const isEmpty = operations.length === 0;

  const handleCloseSheet = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="relative shrink-0">
          <Icons.Notification
            size={20}
            className={cn({
              'animate-pulse': hasPendingOperation,
            })}
          />
          <span
            className={cn(
              'absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-red-600 text-[9px] tabular-nums leading-none text-white lg:-right-1.5 lg:-top-1.5 lg:size-5 lg:text-[9px]',
              {
                hidden: !hasPendingOperation,
              }
            )}
          >
            {numberOfPendingOperation}
          </span>
          <span className="sr-only">Notification</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 p-0 lg:w-96">
        <SheetHeader className="p-4">
          <div className="flex justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Icons.Notification size={18} />
              Notifications ({numberOfPendingOperation})
            </SheetTitle>
            <SheetCloseButton />
          </div>
        </SheetHeader>

        {isEmpty && (
          <div className="px-3">
            <Alert>
              <Icons.Info size={20} />
              <AlertTitle>No notifications found</AlertTitle>
              <AlertDescription>
                Operation notification is not available
              </AlertDescription>
            </Alert>
          </div>
        )}

        <ScrollArea className="h-[calc(100dvh-60px)] px-3 lg:h-[calc(100vh-76px)]">
          <ul className="mb-4 space-y-2 p-1">
            {operations.map((operation) => {
              return (
                <li key={operation.id} onClick={handleCloseSheet}>
                  <NotificationItem
                    title={operation.message}
                    status={operation.status}
                    url={operation.url}
                    date={operation.createdAt}
                  />
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function NotificationItem({
  title,
  status,
  url,
  date,
}: {
  status: 'COMPLETED' | 'PENDING';
  url: string;
  title: string;
  date: Date | string;
}) {
  const formatedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <article className="relative grid grid-cols-[auto,1fr] gap-2 rounded-md border p-2 text-xs hover:ring-2 hover:ring-ring hover:ring-offset-2">
      {status === 'COMPLETED' && (
        <Icons.Correct size={16} className="text-green-600" />
      )}

      {status === 'PENDING' && (
        <Icons.Loader size={16} className="animate-spin" />
      )}

      <div>
        <h3 className="mb-1 font-semibold">
          <Link
            href={url}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </h3>
        <span className="text-muted-foreground">{formatedDate}</span>
      </div>
    </article>
  );
}
