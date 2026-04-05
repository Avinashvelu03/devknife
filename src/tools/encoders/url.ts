/**
 * URL encode/decode.
 * Zero-dependency, uses Node built-in encodeURIComponent/decodeURIComponent.
 */

export function encode(input: string): string {
  return encodeURIComponent(input);
}

export function decode(input: string): string {
  return decodeURIComponent(input);
}

export function encodeComponent(input: string): string {
  return encodeURIComponent(input);
}

export function decodeComponent(input: string): string {
  return decodeURIComponent(input);
}

export function isValidEncoded(str: string): boolean {
  try {
    decodeURIComponent(str);
    return true;
  } catch {
    return false;
  }
}
