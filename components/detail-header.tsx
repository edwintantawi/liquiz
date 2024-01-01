import * as React from 'react';

import { cn } from '~/lib/utils';

interface DetailHeaderProps {
  children?: React.ReactNode;
  startAdornment?: React.ReactNode;
  title: string;
  subtitle?: string;
  color: string;
}

export function DetailHeader({
  children,
  startAdornment,
  title,
  subtitle,
  color,
}: DetailHeaderProps) {
  return (
    <header className={cn(color, 'p-4 py-6')}>
      <div className="flex gap-1">{startAdornment}</div>
      <h1 className="my-1 text-xl font-semibold leading-6 text-white">
        {title}
      </h1>
      <p className="line-clamp-2 text-xs text-gray-100">{subtitle}</p>

      <div className="mt-4 flex gap-2">{children}</div>
    </header>
  );
}
