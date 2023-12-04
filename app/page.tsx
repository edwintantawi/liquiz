import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export const metadata = {
  title: 'Dashboard',
  description: 'Manage all your subjects and topics easily',
};

export default async function RootPage() {
  return (
    <>
      <h1 className="sr-only">LiQuiz Dashboard</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="grid grid-cols-[auto,1fr] items-center gap-3 rounded-md border px-4 py-3">
            <Avatar>
              <AvatarImage src="" alt="" />
              <AvatarFallback>LQ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">LiQuiz User</h2>
              <span className="rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
                user@liquiz.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
