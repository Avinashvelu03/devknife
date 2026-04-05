import { describe, it, expect } from 'vitest';
import {
  DevKnifeError,
  ValidationError,
  ToolNotFoundError,
  SubcommandNotFoundError,
  handleError,
} from '../../src/core/errors.js';

describe('errors', () => {
  describe('DevKnifeError', () => {
    it('should create error with message and code', () => {
      const err = new DevKnifeError('test', 'TEST');
      expect(err.message).toBe('test');
      expect(err.code).toBe('TEST');
      expect(err.name).toBe('DevKnifeError');
      expect(err).toBeInstanceOf(Error);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const err = new ValidationError('invalid input');
      expect(err.message).toBe('invalid input');
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.name).toBe('ValidationError');
      expect(err).toBeInstanceOf(DevKnifeError);
    });
  });

  describe('ToolNotFoundError', () => {
    it('should create tool not found error', () => {
      const err = new ToolNotFoundError('foobar');
      expect(err.message).toContain('foobar');
      expect(err.message).toContain('--help');
      expect(err.code).toBe('TOOL_NOT_FOUND');
      expect(err.name).toBe('ToolNotFoundError');
      expect(err).toBeInstanceOf(DevKnifeError);
    });
  });

  describe('SubcommandNotFoundError', () => {
    it('should create subcommand not found error', () => {
      const err = new SubcommandNotFoundError('base64', 'encrypt');
      expect(err.message).toContain('encrypt');
      expect(err.message).toContain('base64');
      expect(err.code).toBe('SUBCOMMAND_NOT_FOUND');
      expect(err.name).toBe('SubcommandNotFoundError');
      expect(err).toBeInstanceOf(DevKnifeError);
    });
  });

  describe('handleError', () => {
    it('should handle DevKnifeError', () => {
      const output: string[] = [];
      const write = (msg: string) => output.push(msg);
      const err = new DevKnifeError('custom error', 'CUSTOM');
      handleError(err, write);
      expect(output.length).toBe(1);
      expect(output[0]).toContain('custom error');
    });

    it('should handle generic Error', () => {
      const output: string[] = [];
      const write = (msg: string) => output.push(msg);
      const err = new Error('generic');
      handleError(err, write);
      expect(output.length).toBe(1);
      expect(output[0]).toContain('generic');
    });

    it('should handle unknown error type', () => {
      const output: string[] = [];
      const write = (msg: string) => output.push(msg);
      handleError('string error', write);
      expect(output.length).toBe(1);
      expect(output[0]).toContain('Unknown Error');
    });

    it('should handle null', () => {
      const output: string[] = [];
      const write = (msg: string) => output.push(msg);
      handleError(null, write);
      expect(output.length).toBe(1);
      expect(output[0]).toContain('Unknown Error');
    });

    it('should set process.exitCode to 1 for DevKnifeError', () => {
      const write = () => {};
      const err = new DevKnifeError('test', 'TEST');
      process.exitCode = 0;
      handleError(err, write);
      expect(process.exitCode).toBe(1);
    });

    it('should set process.exitCode to 1 for generic Error', () => {
      const write = () => {};
      process.exitCode = 0;
      handleError(new Error('test'), write);
      expect(process.exitCode).toBe(1);
    });
  });
});
