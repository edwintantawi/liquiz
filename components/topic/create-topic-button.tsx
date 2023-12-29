import * as React from 'react';
import Link from 'next/link';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export function CreateTopicButton() {
  return (
    <Button
      asChild
      variant="ghost"
      className="flex h-14 w-full border-spacing-2 items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed px-3 py-4 font-normal text-slate-400 hover:ring-2 hover:ring-ring hover:ring-offset-2"
    >
      <Link href="/topics/new">
        <Icons.AddTopic size={30} strokeWidth={1.5} />
        Create new topic
      </Link>
    </Button>
  );
}
