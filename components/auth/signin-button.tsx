'use client';

import * as React from 'react';

import { signIn } from 'next-auth/react';

import { Button } from '~/components/ui/button';

interface SignInButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function SignInButton({ children, ...props }: SignInButtonProps) {
  return (
    <Button onClick={() => signIn('google')} {...props}>
      {children}
    </Button>
  );
}
