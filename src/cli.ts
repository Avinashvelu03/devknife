#!/usr/bin/env node
/**
 * devknife - CLI Entry Point
 * The ultimate zero-dependency, 50-in-1 developer Swiss Army knife.
 */

import { parse } from './core/parser.js';
import { createLogger } from './core/logger.js';
import { handleError, ToolNotFoundError, SubcommandNotFoundError } from './core/errors.js';
import { startInteractive } from './core/interactive.js';

// Dynamic imports for tools (to keep CLI fast)
import { hash, isSupportedAlgorithm, getSupportedAlgorithms } from './tools/crypto/hash.js';
import { generatePassword, calculateEntropy, estimateStrength } from './tools/crypto/password.js';
import { generateUUID, generateUUIDs } from './tools/generators/uuid.js';
import { generateNanoID } from './tools/generators/nanoid.js';
import { word, sentence, paragraphs, title } from './tools/generators/lorem.js';
import * as base64Module from './tools/encoders/base64.js';
import * as urlModule from './tools/encoders/url.js';
import * as htmlModule from './tools/encoders/html.js';
import * as jwtModule from './tools/encoders/jwt.js';
import * as jsonModule from './tools/formatters/json.js';
import * as textModule from './tools/formatters/text.js';
import * as colorModule from './tools/converters/color.js';
import * as timeModule from './tools/converters/time.js';
import * as numberModule from './tools/converters/number.js';
import * as ipModule from './tools/network/ip.js';
import * as macModule from './tools/network/mac.js';

const VERSION = '1.0.0';

interface ToolDefinition {
  description: string;
  usage: string;
  examples: string[];
  run: (args: string[], stdin?: string) => string | void;
}

const log = createLogger();

const HELP_TEXT = `
${log.color('╔══════════════════════════════════════════════╗', 'cyan')}
${log.color('║', 'cyan')}          ${log.bold(log.color('devknife', 'green'))} — Developer Swiss Army Knife          ${log.color('║', 'cyan')}
${log.color('╚══════════════════════════════════════════════╝', 'cyan')}

${log.bold('Usage:')}
  ${log.color('devknife', 'green')} <${log.color('tool', 'cyan')}> <${log.color('subcommand', 'yellow')}> [${log.color('args', 'gray')}] [${log.color('--flag', 'magenta')}]

${log.bold('Tools:')}

${log.color('  Crypto:', 'cyan')}
    ${log.color('hash', 'green')}      ${log.dim('— Generate hash (md5, sha1, sha256, sha512)')}
    ${log.color('password', 'green')}  ${log.dim('— Generate secure password')}

${log.color('  Generators:', 'cyan')}
    ${log.color('uuid', 'green')}      ${log.dim('— Generate UUID v4')}
    ${log.color('nanoid', 'green')}    ${log.dim('— Generate NanoID string')}
    ${log.color('lorem', 'green')}     ${log.dim('— Generate Lorem Ipsum text')}

${log.color('  Encoders:', 'cyan')}
    ${log.color('base64', 'green')}    ${log.dim('— Base64 encode/decode')}
    ${log.color('url', 'green')}       ${log.dim('— URL encode/decode')}
    ${log.color('html', 'green')}      ${log.dim('— HTML entity encode/decode')}
    ${log.color('jwt', 'green')}       ${log.dim('— Decode JWT token')}

${log.color('  Formatters:', 'cyan')}
    ${log.color('json', 'green')}      ${log.dim('— Format/minify JSON')}
    ${log.color('text', 'green')}      ${log.dim('— Convert text case (camel, snake, kebab...)')}

${log.color('  Converters:', 'cyan')}
    ${log.color('color', 'green')}     ${log.dim('— Convert colors (hex, rgb, hsl)')}
    ${log.color('time', 'green')}      ${log.dim('— Convert timestamps')}
    ${log.color('number', 'green')}    ${log.dim('— Convert number bases (bin, hex, oct)')}

${log.color('  Network:', 'cyan')}
    ${log.color('ip', 'green')}        ${log.dim('— Validate/show IP addresses')}
    ${log.color('mac', 'green')}       ${log.dim('— Generate/validate MAC addresses')}

${log.bold('Flags:')}
    ${log.color('-h, --help', 'yellow')}     ${log.dim('Show this help message')}
    ${log.color('-v, --version', 'yellow')}  ${log.dim('Show version')}
    ${log.color('-i, --interactive', 'yellow')} ${log.dim('Start interactive mode')}
    ${log.color('-s, --stdin', 'yellow')}     ${log.dim('Read input from stdin')}

${log.bold('Examples:')}
    ${log.color('$ devknife uuid', 'gray')}
    ${log.color('$ devknife hash sha256 "Hello World"', 'gray')}
    ${log.color('$ devknife base64 encode "hello"', 'gray')}
    ${log.color('$ devknife jwt decode eyJhbGci...', 'gray')}
    ${log.color('$ echo \'{"a":1}\' | devknife json format', 'gray')}
    ${log.color('$ devknife color hex-to-rgb "#ff0000"', 'gray')}
`;

function getStdin(): Promise<string> {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve('');
      return;
    }
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data.trim());
    });
  });
}

// Tool registry
const tools: Record<string, ToolDefinition> = {
  hash: {
    description: 'Generate hash (md5, sha1, sha256, sha512)',
    usage: 'hash <algorithm> <text>',
    examples: ['hash sha256 "Hello World"', 'hash md5 "test"'],
    run: (args) => {
      const algo = args[0] ?? '';
      const input = args[1] ?? '';
      if (!algo || !input) {
        return `Usage: devknife hash <algorithm> <text>\nAlgorithms: ${getSupportedAlgorithms().join(', ')}`;
      }
      if (!isSupportedAlgorithm(algo)) {
        throw new Error(`Unsupported algorithm: ${algo}. Use: ${getSupportedAlgorithms().join(', ')}`);
      }
      return hash(input, algo);
    },
  },
  password: {
    description: 'Generate secure password',
    usage: 'password [--length N] [--symbols] [--no-ambiguous]',
    examples: ['password', 'password --length 32 --symbols'],
    run: (args, _flags) => {
      const lengthIdx = args.indexOf('--length');
      const length = lengthIdx !== -1 ? parseInt(args[lengthIdx + 1] ?? '16', 10) : 16;
      const hasSymbols = args.includes('--symbols');
      const noAmbiguous = args.includes('--no-ambiguous');
      const pw = generatePassword({ length, numbers: true, symbols: hasSymbols, excludeAmbiguous: noAmbiguous });
      const entropy = calculateEntropy(pw);
      const strength = estimateStrength(pw);
      return `Password: ${pw}\nLength: ${pw.length}\nEntropy: ${entropy} bits\nStrength: ${strength}`;
    },
  },
  uuid: {
    description: 'Generate UUID v4',
    usage: 'uuid [--count N]',
    examples: ['uuid', 'uuid --count 5'],
    run: (args) => {
      const countIdx = args.indexOf('--count');
      const count = countIdx !== -1 ? parseInt(args[countIdx + 1] ?? '1', 10) : 1;
      if (count === 1) return generateUUID();
      return generateUUIDs(count).join('\n');
    },
  },
  nanoid: {
    description: 'Generate NanoID string',
    usage: 'nanoid [--size N]',
    examples: ['nanoid', 'nanoid --size 10'],
    run: (args) => {
      const sizeIdx = args.indexOf('--size');
      const size = sizeIdx !== -1 ? parseInt(args[sizeIdx + 1] ?? '21', 10) : 21;
      return generateNanoID({ size });
    },
  },
  lorem: {
    description: 'Generate Lorem Ipsum text',
    usage: 'lorem <paragraphs|sentences|words> [count]',
    examples: ['lorem paragraphs 2', 'lorem sentences 3', 'lorem words 10'],
    run: (args) => {
      const type = args[0] ?? 'paragraph';
      const count = parseInt(args[1] ?? '1', 10);
      switch (type) {
        case 'paragraph':
        case 'paragraphs':
          return paragraphs(count);
        case 'sentence':
        case 'sentences': {
          const sentences: string[] = [];
          for (let i = 0; i < count; i++) sentences.push(sentence());
          return sentences.join(' ');
        }
        case 'word':
        case 'words':
          return word(count);
        case 'title':
          return title();
        default:
          return paragraphs(count);
      }
    },
  },
  base64: {
    description: 'Base64 encode/decode',
    usage: 'base64 <encode|decode> <text>',
    examples: ['base64 encode "hello"', 'base64 decode "aGVsbG8="'],
    run: (args, stdinData) => {
      const subcommand = args[0] ?? '';
      const input = args[1] ?? stdinData ?? '';
      if (!subcommand || (!input && subcommand)) {
        return 'Usage: devknife base64 <encode|decode> <text>';
      }
      if (subcommand === 'encode') return base64Module.encode(input);
      if (subcommand === 'decode') return base64Module.decode(input);
      throw new SubcommandNotFoundError('base64', subcommand);
    },
  },
  url: {
    description: 'URL encode/decode',
    usage: 'url <encode|decode> <text>',
    examples: ['url encode "hello world"', 'url decode "hello%20world"'],
    run: (args) => {
      const subcommand = args[0] ?? '';
      const input = args[1] ?? '';
      if (!subcommand || !input) return 'Usage: devknife url <encode|decode> <text>';
      if (subcommand === 'encode') return urlModule.encode(input);
      if (subcommand === 'decode') return urlModule.decode(input);
      throw new SubcommandNotFoundError('url', subcommand);
    },
  },
  html: {
    description: 'HTML entity encode/decode',
    usage: 'html <encode|decode> <text>',
    examples: ['html encode "<div>"', 'html decode "&lt;div&gt;"'],
    run: (args) => {
      const subcommand = args[0] ?? '';
      const input = args[1] ?? '';
      if (!subcommand || !input) return 'Usage: devknife html <encode|decode> <text>';
      if (subcommand === 'encode') return htmlModule.encode(input);
      if (subcommand === 'decode') return htmlModule.decode(input);
      throw new SubcommandNotFoundError('html', subcommand);
    },
  },
  jwt: {
    description: 'Decode JWT token',
    usage: 'jwt decode <token>',
    examples: ['jwt decode eyJhbGciOiJIUzI1NiJ9...'],
    run: (args) => {
      const subcommand = args[0] ?? '';
      const token = args[1] ?? '';
      if (!subcommand || !token) return 'Usage: devknife jwt decode <token>';
      if (subcommand === 'decode') {
        try {
          const result = jwtModule.decode(token);
          return `Header:\n${JSON.stringify(result.header, null, 2)}\n\nPayload:\n${JSON.stringify(result.payload, null, 2)}`;
        } catch (err) {
          return `Error: ${err instanceof Error ? err.message : 'Invalid token'}`;
        }
      }
      throw new SubcommandNotFoundError('jwt', subcommand);
    },
  },
  json: {
    description: 'Format/minify JSON',
    usage: 'json <format|minify|validate> [json]',
    examples: ['json format \'{"a":1}\'', 'json minify \'{"a": 1}\''],
    run: (args, stdinData) => {
      const subcommand = args[0] ?? '';
      const input = args[1] ?? stdinData ?? '';
      if (!subcommand || (!input && subcommand)) {
        return 'Usage: devknife json <format|minify|validate|sort> [json]';
      }
      try {
        if (subcommand === 'format' || subcommand === 'prettify') return jsonModule.format(input);
        if (subcommand === 'minify' || subcommand === 'compact') return jsonModule.minify(input);
        if (subcommand === 'validate') {
          const result = jsonModule.validate(input);
          if (result.valid) return '✓ Valid JSON';
          return `✗ Invalid JSON: ${result.error}`;
        }
        if (subcommand === 'sort') return jsonModule.sortByKeys(input);
        throw new SubcommandNotFoundError('json', subcommand);
      } catch (err) {
        return `Error: ${err instanceof Error ? err.message : 'Invalid JSON'}`;
      }
    },
  },
  text: {
    description: 'Convert text case',
    usage: 'text <case> <text>',
    examples: ['text camel "hello world"', 'text snake "helloWorld"', 'text kebab "hello World"'],
    run: (args) => {
      const caseType = args[0] ?? '';
      const input = args[1] ?? '';
      if (!caseType || !input) return 'Usage: devknife text <camel|snake|kebab|pascal|constant|title|upper|lower|sentence|reverse> <text>';
      const cases: Record<string, (s: string) => string> = {
        camel: textModule.camelCase,
        snake: textModule.snakeCase,
        kebab: textModule.kebabCase,
        pascal: textModule.pascalCase,
        constant: textModule.constantCase,
        title: textModule.titleCase,
        upper: textModule.upperCase,
        lower: textModule.lowerCase,
        sentence: textModule.sentenceCase,
        reverse: textModule.reverseCase,
        dot: textModule.dotCase,
        slug: textModule.slugify,
      };
      const fn = cases[caseType];
      if (!fn) throw new SubcommandNotFoundError('text', caseType);
      return fn(input);
    },
  },
  color: {
    description: 'Convert colors (hex, rgb, hsl)',
    usage: 'color <conversion> <value>',
    examples: ['color hex-to-rgb "#ff0000"', 'color rgb-to-hex 255 0 0'],
    run: (args) => {
      const conversion = args[0] ?? '';
      if (!conversion) return 'Usage: devknife color <hex-to-rgb|rgb-to-hex|rgb-to-hsl|hsl-to-hex|is-light> <value>';
      try {
        switch (conversion) {
          case 'hex-to-rgb': {
            const result = colorModule.hexToRgb(args[1] ?? '');
            return `RGB: r=${result.r}, g=${result.g}, b=${result.b}`;
          }
          case 'rgb-to-hex':
            return colorModule.rgbToHex(
              parseInt(args[1] ?? '0', 10),
              parseInt(args[2] ?? '0', 10),
              parseInt(args[3] ?? '0', 10),
            );
          case 'rgb-to-hsl': {
            const result = colorModule.rgbToHsl(
              parseInt(args[1] ?? '0', 10),
              parseInt(args[2] ?? '0', 10),
              parseInt(args[3] ?? '0', 10),
            );
            return `HSL: h=${result.h}°, s=${result.s}%, l=${result.l}%`;
          }
          case 'hex-to-hsl': {
            const result = colorModule.hexToHsl(args[1] ?? '');
            return `HSL: h=${result.h}°, s=${result.s}%, l=${result.l}%`;
          }
          case 'hsl-to-hex':
            return colorModule.hslToHex(
              parseInt(args[1] ?? '0', 10),
              parseInt(args[2] ?? '0', 10),
              parseInt(args[3] ?? '0', 10),
            );
          case 'hsl-to-rgb': {
            const result = colorModule.hslToRgb(
              parseInt(args[1] ?? '0', 10),
              parseInt(args[2] ?? '0', 10),
              parseInt(args[3] ?? '0', 10),
            );
            return `RGB: r=${result.r}, g=${result.g}, b=${result.b}`;
          }
          case 'is-light': {
            const light = colorModule.isLightColor(args[1] ?? '');
            return light ? 'Light color' : 'Dark color';
          }
          default:
            throw new SubcommandNotFoundError('color', conversion);
        }
      } catch (err) {
        return `Error: ${err instanceof Error ? err.message : 'Invalid input'}`;
      }
    },
  },
  time: {
    description: 'Convert timestamps',
    usage: 'time <conversion> <value>',
    examples: ['time epoch-to-iso 1672531200', 'time iso-to-epoch "2023-01-01T00:00:00Z"', 'time now'],
    run: (args) => {
      const conversion = args[0] ?? '';
      if (!conversion) return 'Usage: devknife time <epoch-to-iso|iso-to-epoch|now|time-ago|format> <value>';
      try {
        switch (conversion) {
          case 'epoch-to-iso':
            return timeModule.epochToIso(parseInt(args[1] ?? '0', 10));
          case 'iso-to-epoch':
            return timeModule.isoToEpoch(args[1] ?? '').toString();
          case 'now':
            return `${timeModule.nowIso()} (epoch: ${timeModule.nowEpoch()})`;
          case 'time-ago':
            return timeModule.timeAgo(parseInt(args[1] ?? '0', 10));
          case 'format': {
            const fmt = args[2] ?? 'YYYY-MM-DD HH:mm:ss';
            return timeModule.formatDate(args[1] ?? '', fmt);
          }
          case 'week':
            return `Week ${timeModule.getWeekNumber(args[1] ?? new Date().toISOString())}`;
          default:
            throw new SubcommandNotFoundError('time', conversion);
        }
      } catch (err) {
        return `Error: ${err instanceof Error ? err.message : 'Invalid input'}`;
      }
    },
  },
  number: {
    description: 'Convert number bases',
    usage: 'number <conversion> <value>',
    examples: ['number dec-to-bin 42', 'number bin-to-dec 101010', 'number dec-to-hex 255'],
    run: (args) => {
      const conversion = args[0] ?? '';
      if (!conversion) return 'Usage: devknife number <dec-to-bin|bin-to-dec|dec-to-hex|hex-to-dec|dec-to-oct|oct-to-dec|format-bytes> <value>';
      try {
        switch (conversion) {
          case 'dec-to-bin':
            return numberModule.decimalToBinary(parseInt(args[1] ?? '0', 10));
          case 'bin-to-dec':
            return numberModule.binaryToDecimal(args[1] ?? '0').toString();
          case 'dec-to-hex':
            return numberModule.decimalToHex(parseInt(args[1] ?? '0', 10));
          case 'hex-to-dec':
            return numberModule.hexToDecimal(args[1] ?? '0').toString();
          case 'dec-to-oct':
            return numberModule.decimalToOctal(parseInt(args[1] ?? '0', 10)).toString();
          case 'oct-to-dec':
            return numberModule.octalToDecimal(args[1] ?? '0').toString();
          case 'hex-to-bin':
            return numberModule.hexToBinary(args[1] ?? '0');
          case 'bin-to-hex':
            return numberModule.binaryToHex(args[1] ?? '0');
          case 'format-bytes':
            return numberModule.formatBytes(parseInt(args[1] ?? '0', 10));
          default:
            throw new SubcommandNotFoundError('number', conversion);
        }
      } catch (err) {
        return `Error: ${err instanceof Error ? err.message : 'Invalid input'}`;
      }
    },
  },
  ip: {
    description: 'Validate/show IP addresses',
    usage: 'ip <validate|local|private|reserved|hostname>',
    examples: ['ip validate 192.168.1.1', 'ip local', 'ip hostname'],
    run: (args) => {
      const subcommand = args[0] ?? '';
      if (!subcommand) return 'Usage: devknife ip <validate|local|private|reserved|hostname> [address]';
      switch (subcommand) {
        case 'validate':
        case 'is-valid': {
          const ip = args[1] ?? '';
          if (!ip) return 'Please provide an IP address';
          if (ipModule.isValidIPv4(ip)) return `${ip} is a valid IPv4 address`;
          if (ipModule.isValidIPv6(ip)) return `${ip} is a valid IPv6 address`;
          return `${ip} is not a valid IP address`;
        }
        case 'local': {
          const ips = ipModule.getLocalIPs();
          return ips.length > 0 ? ips.join('\n') : 'No local IPs found';
        }
        case 'private': {
          const ip = args[1] ?? '';
          if (!ip) return 'Please provide an IP address';
          return ipModule.isPrivateIP(ip) ? `${ip} is a private IP` : `${ip} is a public IP`;
        }
        case 'reserved': {
          const ip = args[1] ?? '';
          if (!ip) return 'Please provide an IP address';
          return ipModule.isReservedIP(ip) ? `${ip} is reserved` : `${ip} is not reserved`;
        }
        case 'hostname':
          return ipModule.getHostname();
        default:
          throw new SubcommandNotFoundError('ip', subcommand);
      }
    },
  },
  mac: {
    description: 'Generate/validate MAC address',
    usage: 'mac <generate|validate|normalize> [address]',
    examples: ['mac generate', 'mac validate "00:1A:2B:3C:4D:5E"'],
    run: (args) => {
      const subcommand = args[0] ?? '';
      if (!subcommand) return 'Usage: devknife mac <generate|validate|normalize> [address]';
      switch (subcommand) {
        case 'generate': {
          const sep = args[1] ?? ':';
          return macModule.generateMAC(sep);
        }
        case 'validate': {
          const mac = args[1] ?? '';
          if (!mac) return 'Please provide a MAC address';
          return macModule.isValidMAC(mac) ? `${mac} is a valid MAC address` : `${mac} is not a valid MAC address`;
        }
        case 'normalize': {
          const mac = args[1] ?? '';
          const sep = args[2] ?? ':';
          if (!mac) return 'Please provide a MAC address';
          return macModule.normalizeMAC(mac, sep);
        }
        default:
          throw new SubcommandNotFoundError('mac', subcommand);
      }
    },
  },
};

async function main(): Promise<void> {
  const parsed = parse();

  // Show help
  if (parsed.flags['help'] || parsed.flags['h'] as boolean) {
    log.raw(HELP_TEXT);
    return;
  }

  // Show version
  if (parsed.flags['version'] || parsed.flags['v'] as boolean) {
    log.raw(`devknife v${VERSION}`);
    return;
  }

  // Interactive mode
  if (parsed.flags['interactive'] || parsed.flags['i'] as boolean || !parsed.command) {
    const options = Object.entries(tools).map(([name, tool]) => ({
      label: name,
      value: name,
      description: tool.description,
    }));

    await startInteractive({
      logger: log,
      menuTitle: '🔪 devknife — Interactive Mode',
      options,
      onExit: () => {
        // noop
      },
      onSelect: async (value, promptInput) => {
        const tool = tools[value];
        if (!tool) {
          log.error(`Tool not found: ${value}`);
          return;
        }
        log.newline();
        log.info(`Tool: ${value}`);
        log.dim(`Usage: ${tool.usage}`);
        log.dim(`Examples: ${tool.examples.join(', ')}`);
        log.newline();

        if (promptInput) {
          const input = await promptInput(log.color('Enter input (or press Enter to skip): ', 'cyan'));
          if (input.trim()) {
            const result = tool.run([input.trim()], '');
            if (result) log.raw(result);
          }
        }
      },
    });
    return;
  }

  // Execute tool
  const tool = tools[parsed.command];
  if (!tool) {
    throw new ToolNotFoundError(parsed.command);
  }

  // Handle stdin
  const stdinData = await getStdin();
  const args = parsed.subcommand ? [parsed.subcommand, ...parsed.args] : [...parsed.args];

  const result = tool.run(args, stdinData);
  if (result) {
    log.raw(result);
  }
}

// Run
main().catch((error) => {
  handleError(error);
});
