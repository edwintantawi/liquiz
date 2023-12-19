import * as React from 'react';

interface HeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function Header({ title, description, children }: HeaderProps) {
  return (
    <header className="mb-4 grid grid-cols-[1fr,auto] items-center">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div>{children}</div>
    </header>
  );
}
