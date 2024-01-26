'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SubmitButton({
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending && <Icons.Loader size={20} className="animate-spin" />}
      {children}
    </Button>
  );
}
