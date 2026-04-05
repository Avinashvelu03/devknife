/**
 * Zero-dependency colored terminal output using ANSI escape codes.
 */

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  redBright: '\x1b[91m',
  greenBright: '\x1b[92m',
  yellowBright: '\x1b[93m',
  blueBright: '\x1b[94m',
  magentaBright: '\x1b[95m',
  cyanBright: '\x1b[96m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
} as const;

export type ColorName = keyof typeof ANSI;

export interface Logger {
  info: (msg: string) => void;
  success: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
  raw: (msg: string) => void;
  title: (msg: string) => void;
  table: (rows: string[][]) => void;
  newline: () => void;
  color: (text: string, color: ColorName) => string;
  bold: (text: string) => string;
  dim: (text: string) => string;
}

export function createLogger(write: (msg: string) => void = process.stdout.write.bind(process.stdout)): Logger {
  function colorize(text: string, color: ColorName): string {
    return `${ANSI[color]}${text}${ANSI.reset}`;
  }

  return {
    info(msg: string) {
      write(`${colorize('ℹ', 'blue')} ${msg}\n`);
    },
    success(msg: string) {
      write(`${colorize('✔', 'green')} ${msg}\n`);
    },
    warn(msg: string) {
      write(`${colorize('⚠', 'yellow')} ${msg}\n`);
    },
    error(msg: string) {
      write(`${colorize('✖', 'red')} ${msg}\n`);
    },
    raw(msg: string) {
      write(`${msg}\n`);
    },
    title(msg: string) {
      write(`\n${colorize(colorize(msg, 'bold'), 'cyan')}\n`);
    },
    table(rows: string[][]) {
      if (rows.length === 0) return;
      const colWidths: number[] = [];
      const maxCols = rows[0]!.length;
      for (let col = 0; col < maxCols; col++) {
        let max = 0;
        for (const row of rows) {
          const cell = col < row.length ? row[col]! : '';
          const cellLen = cell.length;
          if (cellLen > max) max = cellLen;
        }
        colWidths.push(max);
      }
      for (const row of rows) {
        const padded = [...row];
        while (padded.length < maxCols) padded.push('');
        const line = padded
          .map((cell, idx) => cell.padEnd(colWidths[idx]!))
          .join('  ');
        write(`  ${line}\n`);
      }
    },
    newline() {
      write('\n');
    },
    color(text: string, color: ColorName) {
      return colorize(text, color);
    },
    bold(text: string) {
      return colorize(text, 'bold');
    },
    dim(text: string) {
      return colorize(text, 'dim');
    },
  };
}

export { ANSI };
