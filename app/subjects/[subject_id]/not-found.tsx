import Link from 'next/link';

import { Caution } from '~/components/caution';
import { Button } from '~/components/ui/button';

export default function NotFoundSubject() {
  return (
    <Caution
      code="404"
      title="Subject Not Found"
      description="Could not find requested subject"
    >
      <Button asChild>
        <Link href="/subjects">View all subjects</Link>
      </Button>
    </Caution>
  );
}
