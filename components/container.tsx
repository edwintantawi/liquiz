import * as React from 'react';

import { cn } from '~/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto max-w-md p-3', className)} {...props}>
      {children}
    </div>
  );
}
