/**
 * Zero-dependency NanoID-like generator.
 * Uses node:crypto for secure randomness.
 */

import { webcrypto } from 'node:crypto';

const DEFAULT_ALPHABET = '-_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_SIZE = 21;

function secureRandom(max: number): number {
  const array = new Uint32Array(1);
  webcrypto.getRandomValues(array);
  return array[0]! % max;
}

export interface NanoIDOptions {
  size?: number;
  alphabet?: string;
}

export function generateNanoID(options: NanoIDOptions = {}): string {
  const size = options.size ?? DEFAULT_SIZE;
  const alphabet = options.alphabet ?? DEFAULT_ALPHABET;

  if (alphabet.length === 0) {
    throw new Error('Alphabet must not be empty');
  }

  let id = '';
  for (let i = 0; i < size; i++) {
    id += alphabet[secureRandom(alphabet.length)]!;
  }
  return id;
}

export function isNanoIDValid(id: string, options: NanoIDOptions = {}): boolean {
  const size = options.size ?? DEFAULT_SIZE;
  const alphabet = options.alphabet ?? DEFAULT_ALPHABET;
  if (id.length !== size) return false;
  return id.split('').every((c) => alphabet.includes(c));
}

export function generateNanoIDs(count: number, options: NanoIDOptions = {}): string[] {
  if (count < 1) throw new Error('Count must be at least 1');
  return Array.from({ length: count }, () => generateNanoID(options));
}
