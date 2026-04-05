/**
 * Base64 encode/decode.
 * Zero-dependency, uses Node Buffer.
 */

export function encode(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64');
}

export function decode(input: string): string {
  return Buffer.from(input, 'base64').toString('utf-8');
}

export function isBase64(str: string): boolean {
  if (str.length === 0) return false;
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(str)) return false;
  return str.length % 4 === 0;
}

export function encodeURLSafe(input: string): string {
  return encode(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeURLSafe(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return decode(base64);
}
