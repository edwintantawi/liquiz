'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

import { signIn } from 'next-auth/react';

import { Button } from '~/components/ui/button';

interface SignInButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function SignInButton({ children, ...props }: SignInButtonProps) {
  const searchParams = useSearchParams();

  const handleSignIn = () => {
    const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
    signIn('google', { callbackUrl });
  };

  return (
    <Button onClick={handleSignIn} {...props}>
      {children}
    </Button>
  );
}
