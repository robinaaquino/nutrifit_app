export function parseError(e: unknown) {
  let errorMessage: string = "Unknown error while adding product";
  if (typeof e === "string") {
    errorMessage = e;
  } else if (e instanceof Error) {
    errorMessage = e.message;
  }

  return errorMessage;
}
