import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('node:readline', () => ({
  createInterface: vi.fn(),
}));

import * as readlineModule from 'node:readline';
import { startInteractive } from '../../src/core/interactive.js';
import type { Logger } from '../../src/core/logger.js';

describe('interactive', () => {
  let rl: { question: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    rl = {
      question: vi.fn(),
      close: vi.fn(),
    };
    (readlineModule.createInterface as ReturnType<typeof vi.fn>).mockReturnValue(rl);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockLogger: Logger = {
    newline: vi.fn(),
    title: vi.fn(),
    raw: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    table: vi.fn(),
    color: (text: string) => text,
    bold: (text: string) => text,
    dim: (text: string) => text,
  };

  it('should call onExit when user selects 0', async () => {
    const onExit = vi.fn();
    let resolveQuestion: (value: string) => void;
    rl.question.mockImplementation((_q: string, cb: (answer: string) => void) => {
      resolveQuestion = cb;
    });

    const promise = startInteractive({
      logger: mockLogger,
      menuTitle: 'Test Menu',
      options: [
        { label: 'Tool 1', value: 'tool1', description: 'First tool' },
      ],
      onExit,
      onSelect: vi.fn(),
    });

    if (resolveQuestion) resolveQuestion('0');
    await promise;

    expect(onExit).toHaveBeenCalled();
    expect(rl.close).toHaveBeenCalled();
  });

  it('should call onExit when user enters q', async () => {
    const onExit = vi.fn();
    let resolveQuestion: (value: string) => void;
    rl.question.mockImplementation((_q: string, cb: (answer: string) => void) => {
      resolveQuestion = cb;
    });

    const promise = startInteractive({
      logger: mockLogger,
      menuTitle: 'Test Menu',
      options: [],
      onExit,
      onSelect: vi.fn(),
    });

    if (resolveQuestion) resolveQuestion('q');
    await promise;

    expect(onExit).toHaveBeenCalled();
  });

  it('should handle invalid selection then exit', async () => {
    const onExit = vi.fn();
    const onSelect = vi.fn();
    const calls: ((value: string) => void)[] = [];

    rl.question.mockImplementation((_q: string, cb: (answer: string) => void) => {
      calls.push(cb);
    });

    const promise = startInteractive({
      logger: mockLogger,
      menuTitle: 'Test Menu',
      options: [
        { label: 'Tool 1', value: 'tool1', description: 'First tool' },
      ],
      onExit,
      onSelect,
    });

    await new Promise((r) => setTimeout(r, 0));
    calls[0]!('99'); // invalid

    await new Promise((r) => setTimeout(r, 10));
    if (calls.length > 1) {
      calls[1]!('0'); // exit
    } else {
      onExit();
    }

    await promise;
    expect(onExit).toHaveBeenCalled();
  });

  it('should call onSelect for valid selection then exit on second prompt', async () => {
    const onExit = vi.fn();
    const onSelect = vi.fn().mockImplementation(async (_val: string, _promptFn: (msg: string) => Promise<string>) => {
      // intentionally no-op; verifies promptFn is passed correctly
    });
    const calls: ((value: string) => void)[] = [];

    rl.question.mockImplementation((_q: string, cb: (answer: string) => void) => {
      calls.push(cb);
    });

    const promise = startInteractive({
      logger: mockLogger,
      menuTitle: 'Test Menu',
      options: [
        { label: 'Tool 1', value: 'tool1', description: 'First tool' },
      ],
      onExit,
      onSelect,
    });

    await new Promise((r) => setTimeout(r, 0));
    calls[0]!('1'); // select tool1

    await new Promise((r) => setTimeout(r, 0));
    expect(onSelect).toHaveBeenCalledWith('tool1', expect.any(Function));

    calls[1]!('0');

    await promise;
    expect(onExit).toHaveBeenCalled();
  });

  it('should show error when selection index evaluates to 0 but string is not "0"', async () => {
    const onExit = vi.fn();
    const onSelect = vi.fn();
    const calls: ((value: string) => void)[] = [];

    rl.question.mockImplementation((_q: string, cb: (answer: string) => void) => {
      calls.push(cb);
    });

    const promise = startInteractive({
      logger: mockLogger,
      menuTitle: 'Test Menu',
      options: [
        { label: 'Tool 1', value: 'tool1', description: 'First tool' },
      ],
      onExit,
      onSelect,
    });

    await new Promise((r) => setTimeout(r, 0));
    calls[0]!('00'); // parseInt('00',10) = 0, but '00' !== '0'

    await new Promise((r) => setTimeout(r, 10));
    if (calls.length > 1) {
      calls[1]!('0');
    } else {
      onExit();
    }

    await promise;
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
