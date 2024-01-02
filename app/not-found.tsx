import Link from 'next/link';

import { Caution } from '~/components/caution';
import { Button } from '~/components/ui/button';

export default function NotFoundRoot() {
  return (
    <Caution
      code="404"
      title="Not Found"
      description="Could not find requested resource"
    >
      <Button asChild>
        <Link href="/dashboard">Return Home</Link>
      </Button>
    </Caution>
  );
}
