import { toast } from "sonner";
import { z } from "zod";

export function getErrorMessage(err: unknown): string {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}

// Standard action error helper used in server actions
export function handleError(err: unknown) {
  return { data: null, error: getErrorMessage(err) } as const;
}