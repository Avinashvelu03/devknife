/**
 * Secure password generator.
 * Zero-dependency, uses only node:crypto for secure randomness.
 */

import { randomBytes, webcrypto } from 'node:crypto';

export interface PasswordOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  excludeAmbiguous?: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = 'Il1O0';

const DEFAULT_OPTIONS: Required<PasswordOptions> = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  excludeAmbiguous: false,
};

function filterAmbiguous(chars: string, exclude: boolean): string {
  if (!exclude) return chars;
  return chars
    .split('')
    .filter((c) => !AMBIGUOUS.includes(c))
    .join('');
}

function secureRandomIndex(max: number): number {
  const array = new Uint32Array(1);
  webcrypto.getRandomValues(array);
  return array[0]! % max;
}

export function generatePassword(options: PasswordOptions = {}): string {
  const opts: Required<PasswordOptions> = { ...DEFAULT_OPTIONS, ...options };

  let charset = '';

  if (opts.uppercase) charset += filterAmbiguous(UPPERCASE, opts.excludeAmbiguous);
  if (opts.lowercase) charset += filterAmbiguous(LOWERCASE, opts.excludeAmbiguous);
  if (opts.numbers) charset += filterAmbiguous(NUMBERS, opts.excludeAmbiguous);
  if (opts.symbols) charset += SYMBOLS;

  if (charset.length === 0) {
    charset = LOWERCASE;
  }

  let password = '';

  // Ensure at least one character from each required set
  if (opts.uppercase) {
    const pool = filterAmbiguous(UPPERCASE, opts.excludeAmbiguous);
    password += pool[secureRandomIndex(pool.length)]!;
  }
  if (opts.lowercase) {
    const pool = filterAmbiguous(LOWERCASE, opts.excludeAmbiguous);
    password += pool[secureRandomIndex(pool.length)]!;
  }
  if (opts.numbers) {
    const pool = filterAmbiguous(NUMBERS, opts.excludeAmbiguous);
    password += pool[secureRandomIndex(pool.length)]!;
  }
  if (opts.symbols) {
    const pool = SYMBOLS;
    password += pool[secureRandomIndex(pool.length)]!;
  }

  // Fill remaining length
  const remaining = opts.length - password.length;
  for (let i = 0; i < remaining; i++) {
    password += charset[secureRandomIndex(charset.length)]!;
  }

  // Shuffle the password
  const arr = password.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }

  return arr.join('');
}

export function calculateEntropy(password: string): number {
  if (password.length === 0) return 0;
  const uniqueChars = new Set(password.split('')).size;
  return Math.floor(password.length * Math.log2(uniqueChars));
}

export function estimateStrength(password: string): 'weak' | 'fair' | 'strong' | 'very-strong' {
  const entropy = calculateEntropy(password);
  if (entropy < 28) return 'weak';
  if (entropy < 36) return 'fair';
  if (entropy < 60) return 'strong';
  return 'very-strong';
}

// Re-export randomBytes for testing
export { randomBytes };
