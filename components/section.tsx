import * as React from 'react';

interface SectionProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
  endAdornment?: React.ReactNode;
}

export function Section({
  children,
  title,
  description,
  endAdornment,
}: SectionProps) {
  return (
    <section className="space-y-4">
      <header className="flex h-10 items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold ">{title}</h2>
          {description && (
            <p className="text-sm leading-none text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div>{endAdornment}</div>
      </header>
      {children}
    </section>
  );
}
