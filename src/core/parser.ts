/**
 * Zero-dependency CLI argument parser.
 * Parses process.argv into a structured command object.
 */

export interface ParseResult {
  command: string;
  subcommand: string;
  args: string[];
  flags: Record<string, string | boolean>;
  raw: string[];
}

export function parse(rawArgv?: string[]): ParseResult {
  const argv = rawArgv !== undefined && rawArgv !== null ? rawArgv : process.argv.slice(2);

  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === '--help' || arg === '-h') {
      flags['help'] = true;
    } else if (arg === '--version' || arg === '-v') {
      flags['version'] = true;
    } else if (arg === '--interactive' || arg === '-i') {
      flags['interactive'] = true;
    } else if (arg === '--stdin' || arg === '-s') {
      flags['stdin'] = true;
    } else if (arg.startsWith('--no-')) {
      const key = arg.slice(5);
      flags[key] = false;
    } else if (arg.startsWith('--')) {
      const eqIndex = arg.indexOf('=');
      if (eqIndex !== -1) {
        const key = arg.slice(2, eqIndex);
        const value = arg.slice(eqIndex + 1);
        flags[key] = value;
      } else {
        const key = arg.slice(2);
        const next = argv[i + 1];
        if (next && !next.startsWith('-')) {
          flags[key] = next;
          i++;
        } else {
          flags[key] = true;
        }
      }
    } else {
      args.push(arg);
    }
  }

  const command = args[0] ?? '';
  const subcommand = args[1] ?? '';

  return {
    command,
    subcommand,
    args: args.slice(2),
    flags,
    raw: argv,
  };
}
