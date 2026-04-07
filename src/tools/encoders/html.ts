/**
 * HTML entity encode/decode.
 * Zero-dependency.
 */

const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const DECODE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&#x2F;': '/',
  '&#x60;': '`',
  '&#x3D;': '=',
  '&apos;': "'",
};

const ENTITY_REGEX = /[&<>"'`=/]/g;
const DECODE_REGEX = /&(?:amp|lt|gt|quot|#39|#x27|#x2F|#x60|#x3D|apos);/g;

export function encode(input: string): string {
  return input.replace(ENTITY_REGEX, (char) => ENTITY_MAP[char] as string);
}

export function decode(input: string): string {
  return input.replace(DECODE_REGEX, (entity) => DECODE_MAP[entity] as string);
}

export function encodeAttribute(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function stripTags(input: string): string {
    let result = input;
    let start = result.indexOf('<');
    while (start !== -1) {
          const end = result.indexOf('>', start);
          if (end === -1) { result = result.slice(0, start); break; }
          result = result.slice(0, start) + result.slice(end + 1);
          start = result.indexOf('<', start);
        }
    return result;
}
