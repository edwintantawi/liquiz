'use client';

import * as React from 'react';

import { signOut } from 'next-auth/react';

import { Button } from '~/components/ui/button';

interface SignOutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function SignOutButton({ children, ...props }: SignOutButtonProps) {
  return (
    <Button onClick={() => signOut()} variant="destructive" {...props}>
      {children}
    </Button>
  );
}
