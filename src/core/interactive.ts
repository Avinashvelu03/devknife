/**
 * Zero-dependency interactive TUI using Node readline.
 */

import * as readline from 'node:readline';
import type { Logger } from './logger.js';

export interface MenuOption {
  label: string;
  value: string;
  description: string;
}

export interface InteractiveConfig {
  logger: Logger;
  menuTitle: string;
  options: MenuOption[];
  onExit: () => void;
  onSelect: (value: string, promptInput?: (msg: string) => Promise<string>) => Promise<void>;
  promptInput?: (msg: string) => Promise<string>;
}

export async function startInteractive(config: InteractiveConfig): Promise<void> {
  const { logger, menuTitle, options, onExit, onSelect } = config;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const promptInputFn: (msg: string) => Promise<string> = (msg: string) =>
    new Promise((resolve) => {
      rl.question(msg, (answer) => {
        resolve(answer);
      });
    });

  function showMenu(): void {
    logger.newline();
    logger.title(menuTitle);
    logger.newline();
    for (let i = 0; i < options.length; i++) {
      const option = options[i]!;
      const num = logger.color(`${i + 1}.`, 'cyan');
      const label = logger.bold(option.label);
      const desc = logger.dim(`— ${option.description}`);
      logger.raw(`  ${num} ${label} ${desc}`);
    }
    logger.raw(`  ${logger.color('0.', 'cyan')} ${logger.bold('Exit')} ${logger.dim('— Quit devknife')}`);
    logger.newline();
  }

  async function run(): Promise<void> {
    showMenu();
    const answer = await promptInputFn(logger.color('Select a tool (0-' + options.length + '): ', 'cyan'));

    const num = parseInt(answer, 10);

    if (answer.toLowerCase() === 'q' || answer === '0' || isNaN(num) || num < 0 || num > options.length) {
      logger.info('Goodbye!');
      rl.close();
      onExit();
      return;
    }

    const selected = options[num - 1];
    if (selected) {
      await onSelect(selected.value, promptInputFn);
      await run();
    } else {
      logger.error('Invalid selection. Please try again.');
      await run();
    }
  }

  await run();
}

export { readline };
