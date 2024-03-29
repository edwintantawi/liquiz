'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';

export function SearchBar() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState(searchParams.get('q') ?? '');

  const [isPending, startTransition] = React.useTransition();

  const isEmptyQuery = query === '';

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputRef.current === null) return;

      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current.focus();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        inputRef.current.blur();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChangeQuery = (event: React.FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const handleClearSearch = () => {
    setQuery('');
    router.push(searchParams.get('back') ?? '/');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) return;

    inputRef.current?.blur();

    startTransition(() => {
      router.push(`/search?q=${query}&back=${pathName}`);
    });
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <div className="relative">
        <Icons.Search
          size={20}
          className="absolute bottom-1/2 left-3 translate-y-1/2 text-slate-400"
        />
        <Input
          ref={inputRef}
          disabled={isPending}
          className={cn('truncate px-11', {
            'pr-14': isEmptyQuery,
          })}
          placeholder="Explore subjects & topics"
          value={query}
          onChange={handleChangeQuery}
        />

        <div className="absolute bottom-1/2 right-1.5 grid translate-y-1/2 place-items-center">
          {isEmptyQuery ? (
            <kbd className="pointer-events-none flex h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium">
              <span className="text-xs">⌘</span>K
            </kbd>
          ) : isPending ? (
            <Icons.Loader
              size={20}
              className="mr-1 animate-spin text-muted-foreground"
            />
          ) : (
            <Button
              type="reset"
              variant="secondary"
              className="size-7 border p-1"
              onClick={handleClearSearch}
            >
              <Icons.Cancel size={16} />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
