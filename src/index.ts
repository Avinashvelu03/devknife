/**
 * devknife - Library Entry Point
 * The ultimate zero-dependency, 50-in-1 developer Swiss Army knife.
 *
 * @example
 * import { generateUUID, rgbToHex, base64Encode } from 'devknife';
 */

// Re-export everything from tools
export * from './tools/index.js';

// Crypto - grouped exports
export const hash = {
  md5: (input: string) => import('./tools/crypto/hash.js').then(m => m.md5(input)),
  sha1: (input: string) => import('./tools/crypto/hash.js').then(m => m.sha1(input)),
  sha256: (input: string) => import('./tools/crypto/hash.js').then(m => m.sha256(input)),
  sha512: (input: string) => import('./tools/crypto/hash.js').then(m => m.sha512(input)),
};

// Generators - grouped exports
export const uuid = {
  v4: () => import('./tools/generators/uuid.js').then(m => m.generateUUID()),
};

export const password = {
  generate: (options?: import('./tools/crypto/password.js').PasswordOptions) =>
    import('./tools/crypto/password.js').then(m => m.generatePassword(options)),
};

// Encoders - grouped exports
export const base64 = {
  encode: (input: string) => import('./tools/encoders/base64.js').then(m => m.encode(input)),
  decode: (input: string) => import('./tools/encoders/base64.js').then(m => m.decode(input)),
};

export const url = {
  encode: (input: string) => import('./tools/encoders/url.js').then(m => m.encode(input)),
  decode: (input: string) => import('./tools/encoders/url.js').then(m => m.decode(input)),
};

export const jwt = {
  decode: (token: string) => import('./tools/encoders/jwt.js').then(m => m.decode(token)),
};

export const json = {
  format: (input: string) => import('./tools/formatters/json.js').then(m => m.format(input)),
  minify: (input: string) => import('./tools/formatters/json.js').then(m => m.minify(input)),
};

// Formatters - grouped exports
export const text = {
  camelCase: (input: string) => import('./tools/formatters/text.js').then(m => m.camelCase(input)),
  snakeCase: (input: string) => import('./tools/formatters/text.js').then(m => m.snakeCase(input)),
  kebabCase: (input: string) => import('./tools/formatters/text.js').then(m => m.kebabCase(input)),
  pascalCase: (input: string) => import('./tools/formatters/text.js').then(m => m.pascalCase(input)),
};

// Converters - grouped exports
export const color = {
  hexToRgb: (hex: string) => import('./tools/converters/color.js').then(m => m.hexToRgb(hex)),
  rgbToHex: (r: number, g: number, b: number) => import('./tools/converters/color.js').then(m => m.rgbToHex(r, g, b)),
};

export const time = {
  epochToIso: (epoch: number) => import('./tools/converters/time.js').then(m => m.epochToIso(epoch)),
  isoToEpoch: (iso: string) => import('./tools/converters/time.js').then(m => m.isoToEpoch(iso)),
};
