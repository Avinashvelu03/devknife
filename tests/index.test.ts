import { describe, it, expect } from 'vitest';

// Import everything from main index
import {
  hash, uuid, password, base64, url, jwt, json, text, color, time,
  // Static re-exports
  sha256, base64Encode, camelCase, hexToRgb, epochToIso, generateUUID,
} from '../src/index.js';

describe('index.ts - library entry point', () => {
  it('should export static re-exports correctly', () => {
    expect(sha256('test')).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
    expect(base64Encode('hello')).toBe('aGVsbG8=');
    expect(camelCase('hello world')).toBe('helloWorld');
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(epochToIso(0)).toBe('1970-01-01T00:00:00.000Z');
    expect(typeof generateUUID).toBe('function');
  });

  it('should export grouped hash object', () => {
    expect(typeof hash.md5).toBe('function');
    expect(typeof hash.sha1).toBe('function');
    expect(typeof hash.sha256).toBe('function');
    expect(typeof hash.sha512).toBe('function');
  });

  it('should export grouped uuid object', () => {
    expect(typeof uuid.v4).toBe('function');
  });

  it('should export grouped password object', () => {
    expect(typeof password.generate).toBe('function');
  });

  it('should export grouped base64 object', () => {
    expect(typeof base64.encode).toBe('function');
    expect(typeof base64.decode).toBe('function');
  });

  it('should export grouped url object', () => {
    expect(typeof url.encode).toBe('function');
    expect(typeof url.decode).toBe('function');
  });

  it('should export grouped jwt object', () => {
    expect(typeof jwt.decode).toBe('function');
  });

  it('should export grouped json object', () => {
    expect(typeof json.format).toBe('function');
    expect(typeof json.minify).toBe('function');
  });

  it('should export grouped text object', () => {
    expect(typeof text.camelCase).toBe('function');
    expect(typeof text.snakeCase).toBe('function');
    expect(typeof text.kebabCase).toBe('function');
    expect(typeof text.pascalCase).toBe('function');
  });

  it('should export grouped color object', () => {
    expect(typeof color.hexToRgb).toBe('function');
    expect(typeof color.rgbToHex).toBe('function');
  });

  it('should export grouped time object', () => {
    expect(typeof time.epochToIso).toBe('function');
    expect(typeof time.isoToEpoch).toBe('function');
  });

  it('dynamic hash.md5 should resolve to correct value', async () => {
    const result = await hash.md5('hello');
    expect(result).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('dynamic hash.sha256 should resolve to correct value', async () => {
    const result = await hash.sha256('hello');
    expect(result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('dynamic hash.sha1 should resolve to correct value', async () => {
    const result = await hash.sha1('hello');
    expect(result).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });

  it('dynamic hash.sha512 should resolve to correct value', async () => {
    const result = await hash.sha512('hello');
    expect(result).toBe('9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043');
  });

  it('dynamic uuid.v4 should return valid UUID', async () => {
    const result = await uuid.v4();
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('dynamic password.generate should return a string', async () => {
    const result = await password.generate({ length: 16 });
    expect(typeof result).toBe('string');
    expect(result.length).toBe(16);
  });

  it('dynamic password.generate with default options', async () => {
    const result = await password.generate();
    expect(typeof result).toBe('string');
    expect(result.length).toBe(16);
  });

  it('dynamic base64.encode should work', async () => {
    const result = await base64.encode('hello');
    expect(result).toBe('aGVsbG8=');
  });

  it('dynamic base64.decode should work', async () => {
    const result = await base64.decode('aGVsbG8=');
    expect(result).toBe('hello');
  });

  it('dynamic url.encode should work', async () => {
    const result = await url.encode('hello world');
    expect(result).toBe('hello%20world');
  });

  it('dynamic url.decode should work', async () => {
    const result = await url.decode('hello%20world');
    expect(result).toBe('hello world');
  });

  it('dynamic jwt.decode should work', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: '123', iat: 1516239022 })).toString('base64url');
    const token = `${header}.${payload}.sig`;
    const result = await jwt.decode(token);
    expect(result.header.typ).toBe('JWT');
    expect(result.payload.sub).toBe('123');
  });

  it('dynamic json.format should work', async () => {
    const result = await json.format('{"a":1}');
    expect(result).toContain('"a"');
  });

  it('dynamic json.minify should work', async () => {
    const result = await json.minify('{ "a" : 1 }');
    expect(result).toBe('{"a":1}');
  });

  it('dynamic text.camelCase should work', async () => {
    const result = await text.camelCase('hello world');
    expect(result).toBe('helloWorld');
  });

  it('dynamic text.snakeCase should work', async () => {
    const result = await text.snakeCase('helloWorld');
    expect(result).toBe('hello_world');
  });

  it('dynamic text.kebabCase should work', async () => {
    const result = await text.kebabCase('helloWorld');
    expect(result).toBe('hello-world');
  });

  it('dynamic text.pascalCase should work', async () => {
    const result = await text.pascalCase('hello world');
    expect(result).toBe('HelloWorld');
  });

  it('dynamic color.hexToRgb should work', async () => {
    const result = await color.hexToRgb('#ff0000');
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('dynamic color.rgbToHex should work', async () => {
    const result = await color.rgbToHex(255, 0, 0);
    expect(result).toBe('#ff0000');
  });

  it('dynamic time.epochToIso should work', async () => {
    const result = await time.epochToIso(0);
    expect(result).toBe('1970-01-01T00:00:00.000Z');
  });

  it('dynamic time.isoToEpoch should work', async () => {
    const result = await time.isoToEpoch('1970-01-01T00:00:00.000Z');
    expect(result).toBe(0);
  });
});
