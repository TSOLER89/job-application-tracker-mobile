export async function readApiError(response: { status: number; json: () => Promise<unknown> }, fallback: string) {
  if (response.status >= 500) return 'Servern kunde inte behandla din begäran. Försök igen om en stund.';
  try {
    const problem = await response.json() as { title?: string; errors?: Record<string, string[]> };
    const messages = Object.values(problem.errors ?? {}).flat();
    return messages.length ? [...new Set(messages)].join(' ') : problem.title || fallback;
  } catch {
    return fallback;
  }
}
