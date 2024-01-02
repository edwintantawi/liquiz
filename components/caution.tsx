import * as React from 'react';

import { Container } from '~/components/container';

interface cautionProps {
  children?: React.ReactNode;
  code: string;
  title: string;
  description: string;
}

export function Caution({ children, code, title, description }: cautionProps) {
  return (
    <Container className="flex flex-col items-center py-6 text-center">
      <span className="font-mono text-5xl font-bold">{code}</span>
      <h1 className="font-mono text-xl font-bold">{title}</h1>
      <p className="mb-5 text-sm text-muted-foreground">{description}</p>
      {children}
    </Container>
  );
}
