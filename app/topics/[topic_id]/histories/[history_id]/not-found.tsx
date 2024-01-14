'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Caution } from '~/components/caution';
import { Button } from '~/components/ui/button';

export default function NotFoundHistory() {
  const params = useParams();

  return (
    <Caution
      code="404"
      title="History Not Found"
      description="Could not find requested history"
    >
      <Button asChild>
        <Link href={`/topics/${params.topic_id}/histories`}>
          View all topic histories
        </Link>
      </Button>
    </Caution>
  );
}
