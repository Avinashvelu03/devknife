/**
 * JSON prettify / minify.
 * Zero-dependency.
 */

export function format(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

export function minify(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function validate(input: string): { valid: boolean; error?: string; data?: unknown } {
  try {
    const data = JSON.parse(input);
    return { valid: true, data };
  } catch (err) {
    const message = (err as Error).message;
    return { valid: false, error: message };
  }
}

export function sortByKeys(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input) as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(parsed).sort()) {
    sorted[key] = parsed[key];
  }
  return JSON.stringify(sorted, null, indent);
}

export function flatten(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function prettyStringify(obj: unknown, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}
