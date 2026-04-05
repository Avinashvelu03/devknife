import { describe, it, expect } from 'vitest';
import { parse } from '../../src/core/parser.js';

describe('parser', () => {
  it('should parse empty args', () => {
    const result = parse([]);
    expect(result.command).toBe('');
    expect(result.subcommand).toBe('');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({});
    expect(result.raw).toEqual([]);
  });

  it('should parse a single command', () => {
    const result = parse(['uuid']);
    expect(result.command).toBe('uuid');
    expect(result.subcommand).toBe('');
    expect(result.args).toEqual([]);
  });

  it('should parse command with subcommand', () => {
    const result = parse(['base64', 'encode', 'hello']);
    expect(result.command).toBe('base64');
    expect(result.subcommand).toBe('encode');
    expect(result.args).toEqual(['hello']);
  });

  it('should parse --help flag', () => {
    const result = parse(['--help']);
    expect(result.flags['help']).toBe(true);
  });

  it('should parse -h flag', () => {
    const result = parse(['-h']);
    expect(result.flags['help']).toBe(true);
  });

  it('should parse --version flag', () => {
    const result = parse(['--version']);
    expect(result.flags['version']).toBe(true);
  });

  it('should parse -v flag', () => {
    const result = parse(['-v']);
    expect(result.flags['version']).toBe(true);
  });

  it('should parse --interactive flag', () => {
    const result = parse(['--interactive']);
    expect(result.flags['interactive']).toBe(true);
  });

  it('should parse -i flag', () => {
    const result = parse(['-i']);
    expect(result.flags['interactive']).toBe(true);
  });

  it('should parse --stdin flag', () => {
    const result = parse(['--stdin']);
    expect(result.flags['stdin']).toBe(true);
  });

  it('should parse --flag with value', () => {
    const result = parse(['--length', '16']);
    expect(result.flags['length']).toBe('16');
  });

  it('should parse --flag=value format', () => {
    const result = parse(['--count=5']);
    expect(result.flags['count']).toBe('5');
  });

  it('should parse --flag without value as boolean true', () => {
    const result = parse(['--symbols']);
    expect(result.flags['symbols']).toBe(true);
  });

  it('should parse --no-flag as boolean false', () => {
    const result = parse(['--no-ambiguous']);
    expect(result.flags['ambiguous']).toBe(false);
  });

  it('should parse complex args', () => {
    const result = parse(['json', 'format', '--indent', '4']);
    expect(result.command).toBe('json');
    expect(result.subcommand).toBe('format');
    expect(result.flags['indent']).toBe('4');
  });

  it('should handle multiple flags', () => {
    const result = parse(['password', '--length', '32', '--symbols', '--no-ambiguous']);
    expect(result.command).toBe('password');
    expect(result.flags['length']).toBe('32');
    expect(result.flags['symbols']).toBe(true);
    expect(result.flags['ambiguous']).toBe(false);
  });

  it('should preserve raw args', () => {
    const result = parse(['hash', 'sha256', 'hello']);
    expect(result.raw).toEqual(['hash', 'sha256', 'hello']);
  });

  it('should not treat flag-like value as flag', () => {
    const result = parse(['hash', 'sha256']);
    expect(result.command).toBe('hash');
    expect(result.subcommand).toBe('sha256');
  });

  it('should handle args after flags', () => {
    const result = parse(['--length', '16', 'uuid']);
    expect(result.command).toBe('uuid');
    expect(result.flags['length']).toBe('16');
  });

  it('should use process.argv when no args provided', () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'devknife', 'test'];
    const result = parse();
    expect(result.raw).toEqual(['test']);
    process.argv = originalArgv;
  });
});
