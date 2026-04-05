/**
 * MAC address generator and validator.
 * Zero-dependency.
 */

import { randomBytes } from 'node:crypto';

const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/;

export function isValidMAC(mac: string): boolean {
  return MAC_REGEX.test(mac);
}

export function generateMAC(separator: string = ':'): string {
  const bytes = Array.from(randomBytes(6), (b) => b!.toString(16).padStart(2, '0').toUpperCase());
  // Set locally administered bit, unicast
  bytes[0] = ((parseInt(bytes[0]!, 16) & 0xfe) | 0x02).toString(16).padStart(2, '0').toUpperCase();
  return bytes.join(separator);
}

export function normalizeMAC(mac: string, separator: string = ':'): string {
  const clean = mac.replace(/[-:]/g, '').toUpperCase();
  if (clean.length !== 12) throw new Error('Invalid MAC address length');
  return clean.match(/.{2}/g)!.join(separator);
}

export function macToHex(mac: string): string {
  const clean = mac.replace(/[-:]/g, '').toLowerCase();
  if (clean.length !== 12) throw new Error('Invalid MAC address');
  return `0x${clean}`;
}

export { randomBytes };
