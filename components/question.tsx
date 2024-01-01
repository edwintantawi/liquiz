import * as React from 'react';

import { Label } from '~/components/ui/label';
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
}

Question.Option = function Option({
  children,
  className,
  disabled,
  ...props
}: OptionProps) {
  const id = React.useId();

  return (
    <fieldset
      disabled={disabled}
      className={cn('group flex items-start gap-3', className)}
    >
      <input
        id={id}
        type="radio"
        className={cn(
          'mt-1 accent-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
          className
        )}
        {...props}
      />
      <Label
        htmlFor={id}
        className="text-sm leading-normal group-disabled:text-muted-foreground/50"
      >
        {children}
      </Label>
    </fieldset>
  );
};
