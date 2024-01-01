import * as React from 'react';
import Link from 'next/link';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

interface CreateTopicButtonProps {
  subjectId?: string;
}

export function CreateTopicButton({ subjectId }: CreateTopicButtonProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className="flex h-14 w-full border-spacing-2 items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed px-3 py-4 font-normal text-slate-400 hover:ring-2 hover:ring-ring hover:ring-offset-2"
    >
      <Link
        href={{
          pathname: '/topics/new',
          search: subjectId && `subject_id=${subjectId}`,
        }}
      >
        <Icons.AddTopic size={30} strokeWidth={1.5} />
        Create new topic
      </Link>
    </Button>
  );
}
