'use client';

import * as React from 'react';

import { useQuery } from '@tanstack/react-query';

import { Icons } from '~/components/icons';
import { formatRetrievalTime } from '~/lib/utils';

interface RetrievalTimeProps {
  targetId: string;
}

export function RetrievalTime({ targetId }: RetrievalTimeProps) {
  const { data } = useQuery({
    queryKey: ['retrieval-time', targetId],
    queryFn: async () => {
      const response = await fetch(`/api/retrieval-time/${targetId}`);
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const result = (await response.json()) as { duration: number | null };
      return result;
    },
    initialData: { duration: null },
  });

  return (
    <p className="flex items-center justify-between border bg-muted px-4 py-2 text-right text-xs text-muted-foreground">
      <span className="flex items-center gap-1 font-semibold">
        <Icons.Timer size={16} />
        Result time:
      </span>{' '}
      {data.duration !== null ? (
        <span className="font-mono">{formatRetrievalTime(data.duration)}</span>
      ) : (
        <span className="font-mono">-- min -- sec</span>
      )}
    </p>
  );
}
