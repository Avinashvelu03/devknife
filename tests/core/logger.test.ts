import { describe, it, expect } from 'vitest';
import { createLogger, ANSI } from '../../src/core/logger.js';

describe('logger', () => {
  it('should create logger with custom write function', () => {
    const output: string[] = [];
    const write = (msg: string) => output.push(msg);
    const logger = createLogger(write);
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should log info message', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.info('test message');
    expect(output.length).toBe(1);
    expect(output[0]).toContain('test message');
    expect(output[0]).toContain(ANSI.blue);
    expect(output[0]).toContain(ANSI.reset);
  });

  it('should log success message', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.success('done');
    expect(output[0]).toContain('done');
    expect(output[0]).toContain(ANSI.green);
  });

  it('should log warn message', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.warn('warning');
    expect(output[0]).toContain('warning');
    expect(output[0]).toContain(ANSI.yellow);
  });

  it('should log error message', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.error('error');
    expect(output[0]).toContain('error');
    expect(output[0]).toContain(ANSI.red);
  });

  it('should log raw message', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.raw('raw message');
    expect(output[0]).toBe('raw message\n');
  });

  it('should log title', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.title('My Title');
    expect(output[0]).toContain('My Title');
    expect(output[0]).toContain(ANSI.cyan);
    expect(output[0]).toContain(ANSI.bold);
  });

  it('should log newline', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.newline();
    expect(output[0]).toBe('\n');
  });

  it('should colorize text', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    const result = logger.color('hello', 'red');
    expect(result).toContain(ANSI.red);
    expect(result).toContain('hello');
    expect(result).toContain(ANSI.reset);
  });

  it('should bold text', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    const result = logger.bold('hello');
    expect(result).toContain(ANSI.bold);
    expect(result).toContain('hello');
  });

  it('should dim text', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    const result = logger.dim('hello');
    expect(result).toContain(ANSI.dim);
    expect(result).toContain('hello');
  });

  it('should format table', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.table([
      ['Name', 'Value'],
      ['foo', 'bar'],
      ['longer', 'val'],
    ]);
    expect(output.length).toBe(3);
    expect(output[0]).toContain('Name');
    expect(output[0]).toContain('Value');
    expect(output[1]).toContain('foo');
    expect(output[2]).toContain('longer');
  });

  it('should handle empty table', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.table([]);
    expect(output.length).toBe(0);
  });

  it('should handle table with rows of different lengths (cell ?? branch)', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    // Pass a row with fewer columns than the header
    logger.table([
      ['Name', 'Value', 'Extra'] as string[],
      ['short'] as unknown as string[],
      ['a', 'b', 'c', 'd'] as string[],
    ]);
    expect(output.length).toBe(3);
  });

  it('should handle table with varying cell widths', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.table([
      ['a', 'bbb'],
      ['cc', 'd'],
    ]);
    expect(output.length).toBe(2);
  });

  it('should handle table with rows of different lengths', () => {
    const output: string[] = [];
    const logger = createLogger((msg) => output.push(msg));
    logger.table([
      ['Name', 'Value', 'Extra'],
      ['short'],
      ['a', 'b', 'c', 'd'],
    ]);
    expect(output.length).toBe(3);
  });
});
