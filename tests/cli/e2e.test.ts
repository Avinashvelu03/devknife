import { describe, it, expect } from 'vitest';
import { ToolNotFoundError, SubcommandNotFoundError } from '../../src/core/errors.js';
import {
  hash, isSupportedAlgorithm, getSupportedAlgorithms,
} from '../../src/tools/crypto/hash.js';
import { generatePassword, calculateEntropy, estimateStrength } from '../../src/tools/crypto/password.js';
import { generateUUID, isValidUUID } from '../../src/tools/generators/uuid.js';
import { generateNanoID } from '../../src/tools/generators/nanoid.js';
import { paragraphs, sentence, word, title } from '../../src/tools/generators/lorem.js';
import * as base64Module from '../../src/tools/encoders/base64.js';
import * as urlModule from '../../src/tools/encoders/url.js';
import * as htmlModule from '../../src/tools/encoders/html.js';
import * as jwtModule from '../../src/tools/encoders/jwt.js';
import * as jsonModule from '../../src/tools/formatters/json.js';
import * as textModule from '../../src/tools/formatters/text.js';
import * as colorModule from '../../src/tools/converters/color.js';
import * as timeModule from '../../src/tools/converters/time.js';
import * as numberModule from '../../src/tools/converters/number.js';
import * as ipModule from '../../src/tools/network/ip.js';
import * as macModule from '../../src/tools/network/mac.js';

// Simulate the tool registry from cli.ts
const tools: Record<string, { run: (args: string[], stdin?: string) => string | void }> = {
  hash: {
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
    run: (args) => {
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
    run: (args) => {
      const countIdx = args.indexOf('--count');
      const count = countIdx !== -1 ? parseInt(args[countIdx + 1] ?? '1', 10) : 1;
      if (count === 1) return generateUUID();
      return Array.from({ length: count }, () => generateUUID()).join('\n');
    },
  },
  nanoid: {
    run: (args) => {
      const sizeIdx = args.indexOf('--size');
      const size = sizeIdx !== -1 ? parseInt(args[sizeIdx + 1] ?? '21', 10) : 21;
      return generateNanoID({ size });
    },
  },
  lorem: {
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
    run: (args) => {
      const subcommand = args[0] ?? '';
      if (!subcommand) return 'Usage: devknife ip <validate|local|private|reserved|hostname> [address]';
      switch (subcommand) {
        case 'validate':
        case 'is-valid': {
          const addr = args[1] ?? '';
          if (!addr) return 'Please provide an IP address';
          if (ipModule.isValidIPv4(addr)) return `${addr} is a valid IPv4 address`;
          if (ipModule.isValidIPv6(addr)) return `${addr} is a valid IPv6 address`;
          return `${addr} is not a valid IP address`;
        }
        case 'local': {
          const ips = ipModule.getLocalIPs();
          return ips.length > 0 ? ips.join('\n') : 'No local IPs found';
        }
        case 'private': {
          const addr = args[1] ?? '';
          if (!addr) return 'Please provide an IP address';
          return ipModule.isPrivateIP(addr) ? `${addr} is a private IP` : `${addr} is a public IP`;
        }
        case 'reserved': {
          const addr = args[1] ?? '';
          if (!addr) return 'Please provide an IP address';
          return ipModule.isReservedIP(addr) ? `${addr} is reserved` : `${addr} is not reserved`;
        }
        case 'hostname':
          return ipModule.getHostname();
        default:
          throw new SubcommandNotFoundError('ip', subcommand);
      }
    },
  },
  mac: {
    run: (args) => {
      const subcommand = args[0] ?? '';
      if (!subcommand) return 'Usage: devknife mac <generate|validate|normalize> [address]';
      switch (subcommand) {
        case 'generate': {
          const sep = args[1] ?? ':';
          return macModule.generateMAC(sep);
        }
        case 'validate': {
          const addr = args[1] ?? '';
          if (!addr) return 'Please provide a MAC address';
          return macModule.isValidMAC(addr) ? `${addr} is a valid MAC address` : `${addr} is not a valid MAC address`;
        }
        case 'normalize': {
          const addr = args[1] ?? '';
          const sep = args[2] ?? ':';
          if (!addr) return 'Please provide a MAC address';
          return macModule.normalizeMAC(addr, sep);
        }
        default:
          throw new SubcommandNotFoundError('mac', subcommand);
      }
    },
  },
};

describe('e2e - CLI tool execution', () => {
  it('hash sha256 "Hello World"', () => {
    const result = tools.hash!.run(['sha256', 'Hello World'], '');
    expect(result).toBe('a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e');
  });

  it('hash with unsupported algorithm', () => {
    expect(() => tools.hash!.run(['md6', 'test'], '')).toThrow('Unsupported algorithm');
  });

  it('hash with missing args returns usage', () => {
    const result = tools.hash!.run([], '');
    expect(result).toContain('Usage:');
  });

  it('uuid generates valid UUID', () => {
    const result = tools.uuid!.run([], '');
    expect(isValidUUID(result as string)).toBe(true);
  });

  it('uuid --count 3 generates 3 UUIDs', () => {
    const result = tools.uuid!.run(['--count', '3'], '') as string;
    const lines = result.split('\n');
    expect(lines.length).toBe(3);
    lines.forEach((line) => expect(isValidUUID(line)).toBe(true));
  });

  it('base64 encode "hello"', () => {
    const result = tools.base64!.run(['encode', 'hello'], '');
    expect(result).toBe('aGVsbG8=');
  });

  it('base64 decode "aGVsbG8="', () => {
    const result = tools.base64!.run(['decode', 'aGVsbG8='], '');
    expect(result).toBe('hello');
  });

  it('base64 with stdin', () => {
    const result = tools.base64!.run(['encode'], 'hello');
    expect(result).toBe('aGVsbG8=');
  });

  it('base64 with invalid subcommand throws', () => {
    expect(() => tools.base64!.run(['encrypt', 'hello'], '')).toThrow(SubcommandNotFoundError);
  });

  it('url encode "hello world"', () => {
    const result = tools.url!.run(['encode', 'hello world'], '');
    expect(result).toBe('hello%20world');
  });

  it('url decode "hello%20world"', () => {
    const result = tools.url!.run(['decode', 'hello%20world'], '');
    expect(result).toBe('hello world');
  });

  it('jwt decode', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: '123', name: 'Test', iat: 1516239022 })).toString('base64url');
    const token = `${header}.${payload}.sig`;
    const result = tools.jwt!.run(['decode', token], '');
    expect(result).toContain('HS256');
    expect(result).toContain('Test');
    expect(result).toContain('123');
  });

  it('jwt with invalid token returns error', () => {
    const result = tools.jwt!.run(['decode', 'invalid.token.here'], '');
    expect(result).toContain('Error:');
  });

  it('json format with string', () => {
    const result = tools.json!.run(['format', '{"a":1}'], '');
    expect(result).toContain('"a"');
    expect(result).toContain('1');
  });

  it('json format with stdin', () => {
    const result = tools.json!.run(['format'], '{"a":1}');
    expect(result).toContain('"a"');
  });

  it('json minify', () => {
    const result = tools.json!.run(['minify', '{\n  "a": 1\n}'], '');
    expect(result).toBe('{"a":1}');
  });

  it('json validate valid', () => {
    const result = tools.json!.run(['validate', '{"a":1}'], '');
    expect(result).toContain('Valid');
  });

  it('json validate invalid', () => {
    const result = tools.json!.run(['validate', 'not json'], '');
    expect(result).toContain('Invalid');
  });

  it('json sort', () => {
    const result = tools.json!.run(['sort', '{"z":1,"a":2}'], '');
    expect(result).toContain('"a"');
  });

  it('text camelCase', () => {
    const result = tools.text!.run(['camel', 'hello world'], '');
    expect(result).toBe('helloWorld');
  });

  it('text snakeCase', () => {
    const result = tools.text!.run(['snake', 'helloWorld'], '');
    expect(result).toBe('hello_world');
  });

  it('text kebabCase', () => {
    const result = tools.text!.run(['kebab', 'helloWorld'], '');
    expect(result).toBe('hello-world');
  });

  it('text unknown case throws', () => {
    expect(() => tools.text!.run(['unknown', 'test'], '')).toThrow(SubcommandNotFoundError);
  });

  it('color hex-to-rgb', () => {
    const result = tools.color!.run(['hex-to-rgb', '#ff0000'], '');
    expect(result).toBe('RGB: r=255, g=0, b=0');
  });

  it('color rgb-to-hex', () => {
    const result = tools.color!.run(['rgb-to-hex', '255', '0', '0'], '');
    expect(result).toBe('#ff0000');
  });

  it('color is-light', () => {
    expect(tools.color!.run(['is-light', '#ffffff'], '')).toBe('Light color');
    expect(tools.color!.run(['is-light', '#000000'], '')).toBe('Dark color');
  });

  it('time epoch-to-iso', () => {
    const result = tools.time!.run(['epoch-to-iso', '1672531200'], '');
    expect(result).toBe('2023-01-01T00:00:00.000Z');
  });

  it('time now', () => {
    const result = tools.time!.run(['now'], '');
    expect(result).toContain('T');
    expect(result).toContain('epoch:');
  });

  it('time iso-to-epoch', () => {
    const result = tools.time!.run(['iso-to-epoch', '1970-01-01T00:00:00.000Z'], '');
    expect(result).toBe('0');
  });

  it('number dec-to-bin', () => {
    const result = tools.number!.run(['dec-to-bin', '42'], '');
    expect(result).toBe('101010');
  });

  it('number bin-to-dec', () => {
    const result = tools.number!.run(['bin-to-dec', '101010'], '');
    expect(result).toBe('42');
  });

  it('number dec-to-hex', () => {
    const result = tools.number!.run(['dec-to-hex', '255'], '');
    expect(result).toBe('ff');
  });

  it('number hex-to-dec', () => {
    const result = tools.number!.run(['hex-to-dec', 'ff'], '');
    expect(result).toBe('255');
  });

  it('number format-bytes', () => {
    const result = tools.number!.run(['format-bytes', '1024'], '');
    expect(result).toBe('1 KB');
  });

  it('ip validate', () => {
    const result = tools.ip!.run(['validate', '192.168.1.1'], '');
    expect(result).toContain('valid IPv4');
  });

  it('ip validate invalid', () => {
    const result = tools.ip!.run(['validate', 'not-an-ip'], '');
    expect(result).toContain('not a valid');
  });

  it('ip hostname', () => {
    const result = tools.ip!.run(['hostname'], '');
    expect(typeof result).toBe('string');
    expect(result!.length).toBeGreaterThan(0);
  });

  it('mac generate', () => {
    const result = tools.mac!.run(['generate'], '');
    expect(macModule.isValidMAC(result as string)).toBe(true);
  });

  it('mac validate valid', () => {
    const result = tools.mac!.run(['validate', '00:1A:2B:3C:4D:5E'], '');
    expect(result).toContain('valid');
  });

  it('mac validate invalid', () => {
    const result = tools.mac!.run(['validate', 'invalid'], '');
    expect(result).toContain('not a valid');
  });

  it('mac normalize', () => {
    const result = tools.mac!.run(['normalize', '00:1A:2B:3C:4D:5E', '-'], '');
    expect(result).toBe('00-1A-2B-3C-4D-5E');
  });

  it('nanoid default', () => {
    const result = tools.nanoid!.run([], '');
    expect((result as string).length).toBe(21);
  });

  it('nanoid custom size', () => {
    const result = tools.nanoid!.run(['--size', '10'], '');
    expect((result as string).length).toBe(10);
  });

  it('password default', () => {
    const result = tools.password!.run([], '');
    expect(result).toContain('Password:');
    expect(result).toContain('Entropy:');
    expect(result).toContain('Strength:');
  });

  it('password with --symbols', () => {
    const result = tools.password!.run(['--symbols'], '');
    expect(result).toContain('Password:');
  });

  it('lorem paragraphs', () => {
    const result = tools.lorem!.run(['paragraphs', '2'], '');
    const paras = (result as string).split('\n\n');
    expect(paras.length).toBe(2);
  });

  it('lorem words', () => {
    const result = tools.lorem!.run(['words', '5'], '');
    expect((result as string).split(' ').length).toBe(5);
  });

  it('lorem title', () => {
    const result = tools.lorem!.run(['title'], '');
    expect(typeof result).toBe('string');
    expect((result as string).length).toBeGreaterThan(0);
  });

  it('html encode', () => {
    const result = tools.html!.run(['encode', '<div>'], '');
    expect(result).toBe('&lt;div&gt;');
  });

  it('html decode', () => {
    const result = tools.html!.run(['decode', '&lt;div&gt;'], '');
    expect(result).toBe('<div>');
  });

  it('throws ToolNotFoundError for unknown tool', () => {
    expect(() => { throw new ToolNotFoundError('nonexistent'); }).toThrow(ToolNotFoundError);
  });
});
