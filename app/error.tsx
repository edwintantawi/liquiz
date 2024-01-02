'use client';

import * as React from 'react';

import { Container } from '~/components/container';
import { Button } from '~/components/ui/button';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center py-6 text-center">
      <span className="font-mono text-5xl font-bold">500</span>
      <h1 className="font-mono text-xl font-bold">Something went wrong!</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Unable to process the request
      </p>
      <Button onClick={reset}>Try Again</Button>
    </Container>
  );
}
