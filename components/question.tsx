import * as React from 'react';

import { Icons } from '~/components/icons';
import { Label } from '~/components/ui/label';
import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/lib/utils';

interface QuestionProps {
  children?: React.ReactNode;
  statement: string;
}

export function Question({ children, statement }: QuestionProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold">
        {statement} <span className="text-red-500">*</span>
      </h2>

      {children}
    </div>
  );
}

interface OptionProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  description?: string;
  isCorrect?: boolean;
}

Question.Option = function Option({
  children,
  className,
  disabled,
  description,
  isCorrect,
  checked,
  ...props
}: OptionProps) {
  const id = React.useId();

  return (
    <div>
      <fieldset
        disabled={disabled}
        className={cn('group flex items-start gap-3', className)}
      >
        <input
          id={id}
          type="radio"
          className={cn(
            'mt-1 accent-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
            className
          )}
          checked={checked}
          {...props}
        />
        <Label
          htmlFor={id}
          className="text-sm leading-normal group-disabled:text-muted-foreground/70"
        >
          {children}{' '}
          {checked ? (
            isCorrect ? (
              <Icons.Correct
                size={16}
                className="-mt-px inline-block text-green-600"
              />
            ) : (
              <Icons.Incorrect
                size={16}
                className="-mt-px inline-block text-red-600"
              />
            )
          ) : null}
        </Label>
      </fieldset>

      {description && checked && (
        <p
          className={cn(
            'mt-2 rounded-sm border px-3 py-2 text-xs leading-normal text-muted-foreground',
            {
              'border-green-600 bg-green-50 text-green-600': isCorrect,
              'border-red-600 bg-red-50 text-red-600': !isCorrect,
            }
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export function OptionSkeleton() {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-2">
      <Skeleton className="size-5 rounded-full" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}

export function QuestionSkeleton() {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-1">
      <Skeleton className="size-6" />
      <div className="space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>

        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <OptionSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuestionListSkeleton({ count }: { count: number }) {
  return (
    <ul className="space-y-8">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <QuestionSkeleton />
        </li>
      ))}
    </ul>
  );
}
