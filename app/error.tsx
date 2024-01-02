'use client';

import * as React from 'react';

import { Caution } from '~/components/caution';
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
    <Caution
      code="500"
      title="Something went wrong!"
      description="Unable to process the request"
    >
      <Button onClick={reset}>Try Again</Button>
    </Caution>
  );
}
