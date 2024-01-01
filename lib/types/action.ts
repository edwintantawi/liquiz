import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionState<T extends z.ZodType<any, any, any>> = {
  message: string | null;
  validationErrors: z.inferFlattenedErrors<T>['fieldErrors'] | null;
  error: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServerAction<T extends z.ZodType<any, any, any>> = (
  state: ActionState<T>,
  formData: FormData
) => Promise<ActionState<T>>;
