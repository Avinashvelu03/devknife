import { describe, it, expect } from 'vitest';
import * as base64 from '../../src/tools/encoders/base64.js';
import * as url from '../../src/tools/encoders/url.js';
import * as html from '../../src/tools/encoders/html.js';
import * as jwt from '../../src/tools/encoders/jwt.js';

describe('encoders - base64', () => {
  it('should encode string to base64', () => {
    expect(base64.encode('hello')).toBe('aGVsbG8=');
  });

  it('should decode base64 to string', () => {
    expect(base64.decode('aGVsbG8=')).toBe('hello');
  });

  it('should encode empty string', () => {
    expect(base64.encode('')).toBe('');
  });

  it('should decode empty string', () => {
    expect(base64.decode('')).toBe('');
  });

  it('should handle unicode', () => {
    const encoded = base64.encode('hello 世界');
    expect(base64.decode(encoded)).toBe('hello 世界');
  });

  it('should validate base64 string', () => {
    expect(base64.isBase64('aGVsbG8=')).toBe(true);
    expect(base64.isBase64('invalid!!!')).toBe(false);
    expect(base64.isBase64('')).toBe(false);
  });

  it('should URL-safe encode', () => {
    const input = 'hello?world=test+data';
    const encoded = base64.encodeURLSafe(input);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');
    expect(base64.decodeURLSafe(encoded)).toBe(input);
  });

  it('should URL-safe decode', () => {
    expect(base64.decodeURLSafe('aGVsbG8')).toBe('hello');
  });
});

describe('encoders - url', () => {
  it('should encode URL component', () => {
    expect(url.encode('hello world')).toBe('hello%20world');
  });

  it('should decode URL component', () => {
    expect(url.decode('hello%20world')).toBe('hello world');
  });

  it('should encode special characters', () => {
    expect(url.encode('a=b&c=d')).toBe('a%3Db%26c%3Dd');
  });

  it('should encode unicode', () => {
    const encoded = url.encode('日本語');
    expect(url.decode(encoded)).toBe('日本語');
  });

  it('should validate encoded string', () => {
    expect(url.isValidEncoded('hello%20world')).toBe(true);
    expect(url.isValidEncoded('hello%ZZ')).toBe(false);
  });

  it('encodeComponent should be same as encode', () => {
    expect(url.encodeComponent('test')).toBe(url.encode('test'));
  });

  it('decodeComponent should be same as decode', () => {
    expect(url.decodeComponent('test%20one')).toBe(url.decode('test%20one'));
  });
});

describe('encoders - html', () => {
  it('should encode HTML entities', () => {
    expect(html.encode('<div>hello</div>')).toBe('&lt;div&gt;hello&lt;&#x2F;div&gt;');
  });

  it('should decode HTML entities', () => {
    expect(html.decode('&lt;div&gt;hello&lt;/div&gt;')).toBe('<div>hello</div>');
  });

  it('should encode ampersand', () => {
    expect(html.encode('a & b')).toBe('a &amp; b');
  });

  it('should encode quotes', () => {
    expect(html.encode('"hello"')).toBe('&quot;hello&quot;');
  });

  it('should encode apostrophe', () => {
    expect(html.encode("it's")).toBe('it&#39;s');
  });

  it('should encode attribute', () => {
    expect(html.encodeAttribute('"onclick="alert(1)"')).toContain('&quot;');
  });

  it('should strip HTML tags', () => {
    expect(html.stripTags('<p>Hello <b>World</b></p>')).toBe('Hello World');
  });

  it('should handle empty string', () => {
    expect(html.encode('')).toBe('');
    expect(html.decode('')).toBe('');
    expect(html.stripTags('')).toBe('');
  });

  it('should handle text without entities', () => {
    expect(html.decode('hello')).toBe('hello');
  });
});

describe('encoders - jwt', () => {
  // Create a valid JWT for testing (header.payload.signature)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: '1234567890', name: 'Test', iat: 1516239022 })).toString('base64url');
  const signature = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const validToken = `${header}.${payload}.${signature}`;

  it('should decode a valid JWT', () => {
    const result = jwt.decode(validToken);
    expect(result.header.alg).toBe('HS256');
    expect(result.header.typ).toBe('JWT');
    expect(result.payload.sub).toBe('1234567890');
    expect(result.payload.name).toBe('Test');
    expect(result.signature).toBe(signature);
  });

  it('should throw for token with wrong number of parts', () => {
    expect(() => jwt.decode('only.two')).toThrow('Invalid JWT');
    expect(() => jwt.decode('one')).toThrow('Invalid JWT');
    expect(() => jwt.decode('')).toThrow('Invalid JWT');
  });

  it('should throw for token with invalid header JSON', () => {
    const badHeader = 'not-json';
    expect(() => jwt.decode(`${badHeader}.{}.sig`)).toThrow('header is not valid JSON');
  });

  it('should throw for token with invalid payload JSON', () => {
    const goodHeader = Buffer.from('{}').toString('base64url');
    expect(() => jwt.decode(`${goodHeader}.not-json.sig`)).toThrow('payload is not valid JSON');
  });

  it('should check if token is valid', () => {
    expect(jwt.isValidJWT(validToken)).toBe(true);
    expect(jwt.isValidJWT('invalid')).toBe(false);
  });

  it('isValidJWT should return false for token with invalid JSON', () => {
    const header = Buffer.from('{"alg":"HS256"}').toString('base64url');
    const payload = Buffer.from('not-json').toString('base64url');
    const token = `${header}.${payload}.sig`;
    expect(jwt.isValidJWT(token)).toBe(false);
  });

  it('should check if token is expired', () => {
    const expiredPayload = Buffer.from(JSON.stringify({ exp: 1 })).toString('base64url');
    const expiredToken = `${header}.${expiredPayload}.sig`;
    const result = jwt.isExpired(expiredToken);
    expect(result.expired).toBe(true);
    expect(result.expiresAt).not.toBeNull();
  });

  it('should return not expired for future exp', () => {
    const futurePayload = Buffer.from(JSON.stringify({ exp: 9999999999 })).toString('base64url');
    const futureToken = `${header}.${futurePayload}.sig`;
    const result = jwt.isExpired(futureToken);
    expect(result.expired).toBe(false);
  });

  it('should return not expired for token without exp', () => {
    const result = jwt.isExpired(validToken);
    expect(result.expired).toBe(false);
    expect(result.expiresAt).toBeNull();
  });

  it('should handle isExpired gracefully for invalid tokens', () => {
    const result = jwt.isExpired('invalid');
    expect(result.expired).toBe(false);
    expect(result.expiresAt).toBeNull();
  });

  it('should get issuer', () => {
    const issPayload = Buffer.from(JSON.stringify({ iss: 'test-issuer' })).toString('base64url');
    const issToken = `${header}.${issPayload}.sig`;
    expect(jwt.getIssuer(issToken)).toBe('test-issuer');
  });

  it('should return null for getIssuer with invalid token', () => {
    expect(jwt.getIssuer('invalid')).toBeNull();
  });

  it('should return null for getIssuer when payload has no iss field', () => {
    const noIssPayload = Buffer.from(JSON.stringify({ sub: '123' })).toString('base64url');
    const noIssToken = `${header}.${noIssPayload}.sig`;
    expect(jwt.getIssuer(noIssToken)).toBeNull();
  });

  it('should get subject', () => {
    expect(jwt.getSubject(validToken)).toBe('1234567890');
  });

  it('should return null for getSubject with invalid token', () => {
    expect(jwt.getSubject('invalid')).toBeNull();
  });

  it('should return null for getSubject when payload has no sub field', () => {
    const noSubPayload = Buffer.from(JSON.stringify({ iss: 'test' })).toString('base64url');
    const noSubToken = `${header}.${noSubPayload}.sig`;
    expect(jwt.getSubject(noSubToken)).toBeNull();
  });

  it('should get expiration date', () => {
    const expPayload = Buffer.from(JSON.stringify({ exp: 1516239022 })).toString('base64url');
    const expToken = `${header}.${expPayload}.sig`;
    const date = jwt.getExpiration(expToken);
    expect(date).toBeInstanceOf(Date);
    expect(date!.getTime()).toBe(1516239022000);
  });

  it('should return null for getExpiration with no exp', () => {
    expect(jwt.getExpiration(validToken)).toBeNull();
  });

  it('should return null for getExpiration with invalid token', () => {
    expect(jwt.getExpiration('invalid')).toBeNull();
  });
});
