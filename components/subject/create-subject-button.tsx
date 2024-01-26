import * as React from 'react';
import Link from 'next/link';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export function CreateSubjectButton() {
  return (
    <Button
      asChild
      variant="ghost"
      className="flex size-full border-spacing-2 flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed px-3 py-8 font-normal text-slate-400 hover:ring-2 hover:ring-ring hover:ring-offset-2"
    >
      <Link href="/subjects/new">
        <Icons.AddSubject size={30} strokeWidth={1.5} />
        Create new subject
      </Link>
    </Button>
  );
}
