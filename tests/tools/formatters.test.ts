import { describe, it, expect } from 'vitest';
import * as json from '../../src/tools/formatters/json.js';
import * as text from '../../src/tools/formatters/text.js';

describe('formatters - json', () => {
  it('should format JSON string', () => {
    expect(json.format('{"a":1}')).toBe('{\n  "a": 1\n}');
  });

  it('should format with custom indent', () => {
    expect(json.format('{"a":1}', 4)).toBe('{\n    "a": 1\n}');
  });

  it('should minify JSON', () => {
    const input = '{\n  "a": 1,\n  "b": 2\n}';
    expect(json.minify(input)).toBe('{"a":1,"b":2}');
  });

  it('should validate valid JSON', () => {
    const result = json.validate('{"a":1}');
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({ a: 1 });
  });

  it('should validate invalid JSON', () => {
    const result = json.validate('not json');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should sort JSON by keys', () => {
    const input = '{"z":1,"a":2,"m":3}';
    const result = json.sortByKeys(input);
    expect(result).toBe('{\n  "a": 2,\n  "m": 3,\n  "z": 1\n}');
  });

  it('should flatten JSON', () => {
    const input = '{\n  "a": 1\n}';
    expect(json.flatten(input)).toBe('{"a":1}');
  });

  it('should prettyStringify an object', () => {
    expect(json.prettyStringify({ a: 1 })).toBe('{\n  "a": 1\n}');
  });

  it('should throw for invalid JSON in format', () => {
    expect(() => json.format('invalid')).toThrow();
  });

  it('should throw for invalid JSON in minify', () => {
    expect(() => json.minify('invalid')).toThrow();
  });

  it('should handle nested objects', () => {
    const input = '{"a":{"b":2}}';
    const result = json.format(input);
    expect(result).toContain('"a"');
    expect(result).toContain('"b"');
  });

  it('should handle arrays', () => {
    expect(json.format('[1,2,3]')).toBe('[\n  1,\n  2,\n  3\n]');
  });
});

describe('formatters - text', () => {
  it('camelCase', () => {
    expect(text.camelCase('hello world')).toBe('helloWorld');
    expect(text.camelCase('hello-world')).toBe('helloWorld');
    expect(text.camelCase('hello_world')).toBe('helloWorld');
    expect(text.camelCase('HelloWorld')).toBe('helloWorld');
    expect(text.camelCase('hello')).toBe('hello');
    expect(text.camelCase('hello-')).toBe('hello');
    expect(text.camelCase('hello ')).toBe('hello');
  });

  it('snakeCase', () => {
    expect(text.snakeCase('helloWorld')).toBe('hello_world');
    expect(text.snakeCase('hello world')).toBe('hello_world');
    expect(text.snakeCase('hello-world')).toBe('hello_world');
    expect(text.snakeCase('HelloWorld')).toBe('hello_world');
  });

  it('kebabCase', () => {
    expect(text.kebabCase('helloWorld')).toBe('hello-world');
    expect(text.kebabCase('hello world')).toBe('hello-world');
    expect(text.kebabCase('hello_world')).toBe('hello-world');
    expect(text.kebabCase('HelloWorld')).toBe('hello-world');
  });

  it('pascalCase', () => {
    expect(text.pascalCase('hello world')).toBe('HelloWorld');
    expect(text.pascalCase('hello-world')).toBe('HelloWorld');
    expect(text.pascalCase('hello_world')).toBe('HelloWorld');
  });

  it('constantCase', () => {
    expect(text.constantCase('hello world')).toBe('HELLO_WORLD');
    expect(text.constantCase('helloWorld')).toBe('HELLO_WORLD');
  });

  it('dotCase', () => {
    expect(text.dotCase('hello world')).toBe('hello.world');
    expect(text.dotCase('helloWorld')).toBe('hello.world');
  });

  it('titleCase', () => {
    expect(text.titleCase('hello world')).toBe('Hello World');
  });

  it('sentenceCase', () => {
    expect(text.sentenceCase('hello world')).toBe('Hello world');
    expect(text.sentenceCase('HELLO WORLD')).toBe('Hello world');
  });

  it('upperCase', () => {
    expect(text.upperCase('hello')).toBe('HELLO');
  });

  it('lowerCase', () => {
    expect(text.lowerCase('HELLO')).toBe('hello');
  });

  it('reverseCase', () => {
    expect(text.reverseCase('Hello')).toBe('hELLO');
    expect(text.reverseCase('aBc')).toBe('AbC');
  });

  it('slugify', () => {
    expect(text.slugify('Hello World!')).toBe('hello-world');
    expect(text.slugify('  foo  bar  ')).toBe('foo-bar');
    expect(text.slugify('a_b_c')).toBe('a-b-c');
  });
});
