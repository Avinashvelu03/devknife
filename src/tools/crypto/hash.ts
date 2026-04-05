/**
 * Hash generators: MD5, SHA-1, SHA-256, SHA-512
 * Zero-dependency, uses only node:crypto
 */

import { createHash } from 'node:crypto';

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

const SUPPORTED_ALGORITHMS: readonly HashAlgorithm[] = ['md5', 'sha1', 'sha256', 'sha512'] as const;

export function hash(input: string, algorithm: HashAlgorithm = 'sha256'): string {
  return createHash(algorithm).update(input).digest('hex');
}

export function md5(input: string): string {
  return hash(input, 'md5');
}

export function sha1(input: string): string {
  return hash(input, 'sha1');
}

export function sha256(input: string): string {
  return hash(input, 'sha256');
}

export function sha512(input: string): string {
  return hash(input, 'sha512');
}

export function isSupportedAlgorithm(algo: string): algo is HashAlgorithm {
  return (SUPPORTED_ALGORITHMS as readonly string[]).includes(algo);
}

export function getSupportedAlgorithms(): readonly HashAlgorithm[] {
  return SUPPORTED_ALGORITHMS;
}

export function hashFile(content: string | Buffer, algorithm: HashAlgorithm = 'sha256'): string {
  return createHash(algorithm).update(content).digest('hex');
}
