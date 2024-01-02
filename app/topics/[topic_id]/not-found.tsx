import Link from 'next/link';

import { Caution } from '~/components/caution';
import { Button } from '~/components/ui/button';

export default function NotFoundTopic() {
  return (
    <Caution
      code="404"
      title="Topic Not Found"
      description="Could not find requested topic"
    >
      <Button asChild>
        <Link href="/topics">View all topics</Link>
      </Button>
    </Caution>
  );
}
