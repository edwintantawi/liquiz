import Link from 'next/link';

import { Button } from '~/components/ui/button';

export default function NotFoundTopic() {
  return (
    <div className="flex flex-col items-center py-6">
      <span className="font-mono text-5xl font-bold">404</span>
      <h1 className="font-mono text-xl font-bold">Topic Not Found</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Could not find requested topic
      </p>
      <Button asChild>
        <Link href="/topics">View all topics</Link>
      </Button>
    </div>
  );
}
