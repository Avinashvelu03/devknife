import { describe, it, expect } from 'vitest';
import { hash, md5, sha1, sha256, sha512, isSupportedAlgorithm, getSupportedAlgorithms, hashFile } from '../../src/tools/crypto/hash.js';
import { generatePassword, calculateEntropy, estimateStrength } from '../../src/tools/crypto/password.js';

describe('crypto - hash', () => {
  it('should generate md5 hash', () => {
    expect(md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('should generate sha1 hash', () => {
    expect(sha1('hello')).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });

  it('should generate sha256 hash', () => {
    expect(sha256('hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('should generate sha512 hash', () => {
    expect(sha512('hello')).toBe('9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043');
  });

  it('should hash with specific algorithm via hash()', () => {
    expect(hash('test', 'md5')).toBe('098f6bcd4621d373cade4e832627b4f6');
    expect(hash('test', 'sha256')).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  it('should default to sha256', () => {
    expect(hash('test')).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  it('should return true for supported algorithm', () => {
    expect(isSupportedAlgorithm('md5')).toBe(true);
    expect(isSupportedAlgorithm('sha1')).toBe(true);
    expect(isSupportedAlgorithm('sha256')).toBe(true);
    expect(isSupportedAlgorithm('sha512')).toBe(true);
  });

  it('should return false for unsupported algorithm', () => {
    expect(isSupportedAlgorithm('md6')).toBe(false);
    expect(isSupportedAlgorithm('')).toBe(false);
  });

  it('should return all supported algorithms', () => {
    const algos = getSupportedAlgorithms();
    expect(algos).toContain('md5');
    expect(algos).toContain('sha1');
    expect(algos).toContain('sha256');
    expect(algos).toContain('sha512');
  });

  it('should hash file content', () => {
    expect(hashFile('hello', 'sha256')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('should hash Buffer content', () => {
    expect(hashFile(Buffer.from('hello'), 'sha256')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('should hash empty string', () => {
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});

describe('crypto - password', () => {
  it('should generate a password with default options', () => {
    const pw = generatePassword();
    expect(pw).toBeDefined();
    expect(typeof pw).toBe('string');
    expect(pw.length).toBe(16);
  });

  it('should generate password with custom length', () => {
    const pw = generatePassword({ length: 8 });
    expect(pw.length).toBe(8);
  });

  it('should generate password with symbols', () => {
    const pw = generatePassword({ length: 32, symbols: true });
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(pw);
    expect(hasSymbol).toBe(true);
  });

  it('should generate password without ambiguous characters', () => {
    const pw = generatePassword({ length: 100, excludeAmbiguous: true });
    const hasAmbiguous = /[Il1O0]/.test(pw);
    expect(hasAmbiguous).toBe(false);
  });

  it('should always include uppercase when uppercase: true', () => {
    let allUpper = true;
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword({ length: 20, uppercase: true, lowercase: false, numbers: false });
      if (!/[A-Z]/.test(pw)) { allUpper = false; break; }
    }
    expect(allUpper).toBe(true);
  });

  it('should always include numbers when numbers: true', () => {
    let allNumbers = true;
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword({ length: 20, uppercase: false, lowercase: false, numbers: true });
      if (!/[0-9]/.test(pw)) { allNumbers = false; break; }
    }
    expect(allNumbers).toBe(true);
  });

  it('should calculate entropy', () => {
    expect(calculateEntropy('abc')).toBeGreaterThan(0);
    expect(calculateEntropy('')).toBe(0);
  });

  it('should estimate strength - weak', () => {
    expect(estimateStrength('abc')).toBe('weak');
  });

  it('should estimate strength - fair', () => {
    const pw = 'abcdefghij'; // 10 lowercase chars
    expect(estimateStrength(pw)).toBe('fair');
  });

  it('should estimate strength - strong', () => {
    // entropy = 11 * log2(11) ≈ 38 → strong
    expect(estimateStrength('abcdefghijk')).toBe('strong');
  });

  it('should estimate strength - very-strong', () => {
    const pw = generatePassword({ length: 64, symbols: true, numbers: true });
    expect(estimateStrength(pw)).toBe('very-strong');
  });

  it('should fallback to lowercase when all char sets disabled', () => {
    const pw = generatePassword({ uppercase: false, lowercase: false, numbers: false, symbols: false, length: 10 });
    expect(pw.length).toBe(10);
    expect(/^[a-z]+$/.test(pw)).toBe(true);
  });
});
