'use client';

import * as React from 'react';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  Sheet,
  SheetClose,
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
  const [prevOperations, setPrevOperations] = React.useState<Operation[]>([]);
  const [opertionChangedIds, setOpertionChangedIds] = React.useState<string[]>(
    []
  );
  const { data: operations = [] } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['operations'],
    queryFn: async () => {
      const response = await fetch('/api/fetcher/operations');
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const result = (await response.json()) as Operation[];
      if (prevOperations.length === 0) {
        setPrevOperations(result);
        return result;
      }

      for (const item of result) {
        const oldResult = prevOperations.find(
          (oldOperation) => oldOperation.id === item.id
        );
        if (oldResult?.status !== item.status) {
          setOpertionChangedIds([...opertionChangedIds, item.id]);
        }
      }

      setPrevOperations(result);
      return result;
    },
    refetchInterval: 10_000,
  });

  const numberOfPendingOperation =
    operations?.filter((operation) => operation.status === 'PENDING').length ??
    0;

  const hasPendingOperation = numberOfPendingOperation > 0;

  const isEmpty = operations.length === 0;

  return (
    <Sheet>
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
              'absolute -right-1.5 -top-1.5 grid size-[1.1rem] lg:size-[1.2rem]',
              {
                hidden: !hasPendingOperation,
              }
            )}
          >
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative grid size-[1.1rem] place-content-center rounded-full bg-red-600 text-[9px] tabular-nums leading-none text-white lg:size-[1.2rem]">
              {numberOfPendingOperation}
            </span>
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
              const isNew =
                opertionChangedIds.findIndex((id) => operation.id === id) !==
                -1;

              return (
                <li key={operation.id}>
                  <NotificationItem
                    type={operation.type}
                    status={operation.status}
                    title={operation.message}
                    url={operation.url}
                    color={operation.color}
                    date={operation.date}
                    isNew={isNew}
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
  status,
  type,
  title,
  url,
  color,
  date,
  isNew,
}: {
  status: 'COMPLETED' | 'PENDING';
  type: 'TOPIC' | 'HISTORY';
  title: string;
  url: string;
  color: string;
  date: Date | string;
  isNew: boolean;
}) {
  const formatedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const iconType: Record<'TOPIC' | 'HISTORY', React.ReactNode> = {
    HISTORY: <Icons.AI size={12} className={cn('inline stroke-white')} />,
    TOPIC: <Icons.Topic size={12} className={cn('inline stroke-white')} />,
  };

  return (
    <article
      className={cn(
        'relative grid grid-cols-[auto,auto,1fr] gap-2 rounded-md border p-2 text-xs hover:ring-2 hover:ring-ring hover:ring-offset-2',
        {
          'animate-pulse-once bg-green-600/10':
            isNew === true && status === 'COMPLETED',
          'animate-pulse': status === 'PENDING',
        }
      )}
    >
      <div className="flex flex-col items-center gap-1">
        <span className={cn('aspect-square rounded-sm px-1 py-0.5', color)}>
          {iconType[type]}
        </span>
      </div>

      <div>
        <h3 className="mb-1 font-semibold">
          <SheetClose asChild>
            <Link
              href={url}
              className="after:absolute after:inset-0 after:content-['']"
            >
              <span className="mr-1">
                {status === 'COMPLETED' && (
                  <Icons.Correct size={16} className="inline text-green-600" />
                )}
                {status === 'PENDING' && (
                  <Icons.Loader size={16} className="inline animate-spin" />
                )}
              </span>
              {title}
            </Link>
          </SheetClose>
        </h3>
        <span className="text-muted-foreground">{formatedDate}</span>
      </div>
    </article>
  );
}
