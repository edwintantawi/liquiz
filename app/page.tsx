import { redirect } from 'next/navigation';

import { SignInButton } from '~/components/auth';
import { auth } from '~/lib/auth';

export default async function RootPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) redirect('/dashboard');

  return (
    <div className="my-auto">
      <header className="py-6">
        <h1 className="mb-2 text-center text-3xl font-bold">
          AI-Powered Practice Question Generator
        </h1>
        <p className="mb-5 px-4 text-center text-sm font-light text-muted-foreground">
          Turn your study materials into a dynamic and interactive learning
          experience with our AI-powered question generator.
        </p>

        <div className="flex justify-center">
          <SignInButton>Getting started</SignInButton>
        </div>
      </header>
    </div>
  );
}
