/**
 * UUID v4 generator.
 * Zero-dependency, uses node:crypto for secure randomness.
 */

import { randomBytes } from 'node:crypto';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function generateUUID(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 1

  const hex = Array.from(bytes, (b) => b!.toString(16).padStart(2, '0')).join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

export function isValidUUID(id: string): boolean {
  return UUID_V4_REGEX.test(id);
}

export function generateUUIDs(count: number): string[] {
  if (count < 1) throw new Error('Count must be at least 1');
  return Array.from({ length: count }, () => generateUUID());
}

export { randomBytes };
