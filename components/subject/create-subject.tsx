'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icons } from '~/components/icons';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { createSubject } from '~/lib/actions/subject';
import { createSubjectSchema } from '~/lib/schema/subject';

export function CreateSubject() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const form = useForm<z.infer<typeof createSubjectSchema>>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      title: '',
      description: '',
      document: undefined,
    },
  });

  const handleCloseDialog = () => {
    form.reset();
    setIsOpen(false);
  };

  const handleOpenDialog = (open: boolean) => {
    if (open === false) return handleCloseDialog();
    setIsOpen(open);
  };

  const handleSubmit: SubmitHandler<
    z.infer<typeof createSubjectSchema>
  > = async (data) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.set(key, value);
    }

    const result = await createSubject(formData);
    if (result.error !== null) {
      setError(result.error);
      return;
    }

    setError(null);
    console.log(result);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-full min-h-[157px] w-full border-spacing-2 flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed p-3 font-normal text-slate-400 hover:ring-2 hover:ring-ring hover:ring-offset-2"
        >
          <Icons.AddSubject size={30} strokeWidth={1.5} />
          Create new subject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Subject</DialogTitle>
          <DialogDescription>
            Introduce a Fresh Learning Focus!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset
              disabled={form.formState.isSubmitting}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="My lovely subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Document</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="file"
                        accept="application/pdf"
                        value={undefined}
                        onChange={(event) => {
                          onChange(event.target.files?.[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <Icons.Error size={20} />
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="reset"
                  variant="destructive"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {form.formState.isSubmitting && (
                    <Icons.Loader size={20} className="animate-spin" />
                  )}
                  Create
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
