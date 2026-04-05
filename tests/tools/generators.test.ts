import { describe, it, expect } from 'vitest';
import { generateUUID, isValidUUID, generateUUIDs } from '../../src/tools/generators/uuid.js';
import { generateNanoID, isNanoIDValid, generateNanoIDs } from '../../src/tools/generators/nanoid.js';
import { word, sentence, paragraph, paragraphs, title } from '../../src/tools/generators/lorem.js';

describe('generators - uuid', () => {
  it('should generate a valid UUID v4', () => {
    const id = generateUUID();
    expect(isValidUUID(id)).toBe(true);
  });

  it('should generate unique UUIDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateUUID()));
    expect(ids.size).toBe(100);
  });

  it('should match UUID v4 format', () => {
    const id = generateUUID();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('should validate correct UUID', () => {
    expect(isValidUUID('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
  });

  it('should reject invalid UUID', () => {
    expect(isValidUUID('not-a-uuid')).toBe(false);
    expect(isValidUUID('')).toBe(false);
    expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false);
  });

  it('should generate multiple UUIDs', () => {
    const ids = generateUUIDs(5);
    expect(ids).toHaveLength(5);
    ids.forEach((id) => {
      expect(isValidUUID(id)).toBe(true);
    });
  });

  it('should throw for count < 1', () => {
    expect(() => generateUUIDs(0)).toThrow('Count must be at least 1');
    expect(() => generateUUIDs(-1)).toThrow('Count must be at least 1');
  });
});

describe('generators - nanoid', () => {
  it('should generate a NanoID with default length', () => {
    const id = generateNanoID();
    expect(id).toHaveLength(21);
  });

  it('should generate a NanoID with custom length', () => {
    const id = generateNanoID({ size: 10 });
    expect(id).toHaveLength(10);
  });

  it('should generate unique NanoIDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateNanoID()));
    expect(ids.size).toBe(100);
  });

  it('should only contain valid characters', () => {
    const id = generateNanoID();
    expect(id).toMatch(/^[-_0-9a-zA-Z]+$/);
  });

  it('should validate correct NanoID', () => {
    const id = generateNanoID();
    expect(isNanoIDValid(id)).toBe(true);
  });

  it('should reject invalid NanoID', () => {
    expect(isNanoIDValid('too short')).toBe(false);
    expect(isNanoIDValid('')).toBe(false);
  });

  it('should validate with custom options', () => {
    const id = generateNanoID({ size: 10, alphabet: 'abc' });
    expect(isNanoIDValid(id, { size: 10, alphabet: 'abc' })).toBe(true);
    expect(isNanoIDValid(id)).toBe(false); // default size is 21
  });

  it('should throw for empty alphabet', () => {
    expect(() => generateNanoID({ alphabet: '' })).toThrow('Alphabet must not be empty');
  });

  it('should generate multiple NanoIDs', () => {
    const ids = generateNanoIDs(3, { size: 10 });
    expect(ids).toHaveLength(3);
    ids.forEach((id) => expect(id).toHaveLength(10));
  });

  it('should throw for count < 1 in generateNanoIDs', () => {
    expect(() => generateNanoIDs(0)).toThrow('Count must be at least 1');
  });
});

describe('generators - lorem', () => {
  it('should generate a single word', () => {
    const w = word(1);
    expect(typeof w).toBe('string');
    expect(w.split(' ').length).toBe(1);
  });

  it('should generate multiple words', () => {
    const w = word(5);
    expect(w.split(' ').length).toBe(5);
  });

  it('should generate a sentence', () => {
    const s = sentence();
    expect(s).toMatch(/^[A-Z].*\.$/);
  });

  it('should generate sentence with specified word count', () => {
    const s = sentence(10);
    expect(s.endsWith('.')).toBe(true);
  });

  it('should generate a paragraph', () => {
    const p = paragraph();
    expect(typeof p).toBe('string');
    expect(p.length).toBeGreaterThan(0);
  });

  it('should generate multiple paragraphs', () => {
    const ps = paragraphs(3);
    const split = ps.split('\n\n');
    expect(split.length).toBe(3);
  });

  it('should generate paragraphs with custom separator', () => {
    const ps = paragraphs(2, '---');
    expect(ps.split('---').length).toBe(2);
  });

  it('should generate a title', () => {
    const t = title();
    expect(typeof t).toBe('string');
    expect(t.length).toBeGreaterThan(0);
  });

  it('should generate title with specified word count', () => {
    const t = title(5);
    const words = t.split(' ');
    expect(words.length).toBe(5);
    words.forEach((w) => {
      expect(w[0]).toMatch(/[A-Z]/);
    });
  });

  it('should generate paragraph with sentence count', () => {
    const p = paragraph(1);
    expect(typeof p).toBe('string');
  });
});
