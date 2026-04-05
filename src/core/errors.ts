/**
 * CLI-specific error handling for devknife.
 */

export class DevKnifeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'DevKnifeError';
  }
}

export class ValidationError extends DevKnifeError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class ToolNotFoundError extends DevKnifeError {
  constructor(toolName: string) {
    super(`Tool not found: ${toolName}. Run 'devknife --help' to see available tools.`, 'TOOL_NOT_FOUND');
    this.name = 'ToolNotFoundError';
  }
}

export class SubcommandNotFoundError extends DevKnifeError {
  constructor(tool: string, subcommand: string) {
    super(
      `Unknown subcommand '${subcommand}' for tool '${tool}'. Run 'devknife ${tool} --help' for usage.`,
      'SUBCOMMAND_NOT_FOUND',
    );
    this.name = 'SubcommandNotFoundError';
  }
}

export function handleError(error: unknown, write: (msg: string) => void = process.stderr.write.bind(process.stderr)): void {
  if (error instanceof DevKnifeError) {
    write(`\x1b[31m✖ Error: ${error.message}\x1b[0m\n`);
    process.exitCode = 1;
  } else if (error instanceof Error) {
    write(`\x1b[31m✖ Unexpected Error: ${error.message}\x1b[0m\n`);
    process.exitCode = 1;
  } else {
    write(`\x1b[31m✖ Unknown Error\x1b[0m\n`);
    process.exitCode = 1;
  }
}
