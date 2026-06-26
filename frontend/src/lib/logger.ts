export function logError(context: string, error: unknown): void {
  const ts = new Date().toISOString();
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[${ts}] [${context}] ${msg}`);
  if (error instanceof Error && error.stack) {
    console.error(`[${ts}] [${context}] STACK: ${error.stack}`);
  }
}
