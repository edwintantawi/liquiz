import * as React from 'react';

import { cn } from '~/lib/utils';

interface SubjectHeaderProps {
  children?: React.ReactNode;
  startAdornment?: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export function SubjectHeader({
  children,
  startAdornment,
  title,
  description,
  color,
}: SubjectHeaderProps) {
  return (
    <header className={cn(color, 'p-4 py-6')}>
      <div className="flex gap-1">{startAdornment}</div>
      <h1 className="my-1 text-xl font-semibold leading-6 text-white">
        {title}
      </h1>
      <p className="line-clamp-2 text-xs text-gray-300">
        {description || '<no description>'}
      </p>

      <div className="mt-4 flex gap-2">{children}</div>
    </header>
  );
}
