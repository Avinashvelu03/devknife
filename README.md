# 🔪 devknife

> The ultimate zero-dependency, 50-in-1 developer Swiss Army knife CLI and library.

[![npm version](https://img.shields.io/npm/v/devknife.svg)](https://www.npmjs.com/package/devknife)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Library Coverage: 100%](https://img.shields.io/badge/Library%20Coverage-100%25-brightgreen.svg)](https://github.com/Avinashvelu03/devknife)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-green.svg)](https://github.com/Avinashvelu03/devknife)
[![Node >= 18](https://img.shields.io/badge/Node-%3E%3D%2018-339933.svg)](https://nodejs.org)
[![GitHub Stars](https://img.shields.io/github/stars/Avinashvelu03/devknife?style=flat-square&color=yellow)](https://github.com/Avinashvelu03/devknife)

```
    ____  __.     .__                           ___________.__
    |    |/ _|____ |  |__ ___.__._____           \__    ___/|__| _____  ____
    |      < /  _ \|  |  <   |  |\__  \  ______    |    |   |  |/     \/ ___\
    |    |  (  <_> )   Y  \___  |  |/ __ \_/_____/   |    |   |  |  Y Y  \  \___
    |____|__ \____/|___|  / ____|  (____  /         |____|   |__|__|_|  /\___  >
            \/          \/\/          \/                              \/     \/
```

## Why devknife?

Developers waste hours switching context to browser tabs to decode JWTs, format JSON, convert timestamps, or generate UUIDs. **devknife** brings all these utilities into the terminal with sub-millisecond execution times, zero bloated dependencies, and an interactive TUI.

## Installation

### Global (recommended)
```bash
npm install -g devknife
```

### NPX (no install)
```bash
npx devknife uuid
```

### Local Library
```bash
npm install devknife
```

## Quick Start

### CLI Usage

```bash
# Generate a UUID
$ devknife uuid
> 8a7f9b84-4d2a-48a3-9f8a-92b1a134c8a2

# Hash a string
$ devknife hash sha256 "Hello World"
> a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

# Decode a JWT
$ devknife jwt decode eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkF2aW5hc2gifQ.abc
> Header: { "alg": "HS256" }
> Payload: { "sub": "1234567890", "name": "Avinash" }

# Format JSON from stdin
$ echo '{"a":1}' | devknife json format
> {
>   "a": 1
> }

# Interactive mode (no arguments)
$ devknife
```

### Library Usage

```typescript
import {
  generateUUID, base64Encode, rgbToHex, epochToIso,
  camelCase, generatePassword, jwtDecode
} from 'devknife';

// Generators
generateUUID()           // "123e4567-e89b-12d3-a456-426614174000"
generatePassword({ length: 16, symbols: true })

// Encoders
base64Encode('hello')    // "aGVsbG8="
jwtDecode('ey...')      // { header: {...}, payload: {...} }

// Converters
rgbToHex(255, 0, 0)     // "#ff0000"
epochToIso(1672531200)  // "2023-01-01T00:00:00.000Z"

// Formatters
camelCase('hello world') // "helloWorld"
```

## CLI Commands

| Category | Command | Example | Description |
|----------|---------|---------|-------------|
| **Crypto** | `hash` | `devknife hash sha256 "text"` | MD5, SHA-1, SHA-256, SHA-512 |
| | `password` | `devknife password --length 32 --symbols` | Generate secure passwords |
| **Generators** | `uuid` | `devknife uuid --count 5` | Generate UUID v4 |
| | `nanoid` | `devknife nanoid --size 10` | Generate NanoID string |
| | `lorem` | `devknife lorem paragraphs 3` | Lorem Ipsum text |
| **Encoders** | `base64` | `devknife base64 encode "hello"` | Base64 encode/decode |
| | `url` | `devknife url encode "hello world"` | URL encode/decode |
| | `html` | `devknife html encode "<div>"` | HTML entity encode/decode |
| | `jwt` | `devknife jwt decode <token>` | Decode JWT tokens |
| **Formatters** | `json` | `devknife json format '{"a":1}'` | Format/minify/validate JSON |
| | `text` | `devknife text camel "hello world"` | String case conversion |
| **Converters** | `color` | `devknife color hex-to-rgb "#ff0000"` | HEX/RGB/HSL conversions |
| | `time` | `devknife time epoch-to-iso 1672531200` | Timestamp conversions |
| | `number` | `devknife number dec-to-bin 42` | Binary/Hex/Octal/Decimal |
| **Network** | `ip` | `devknife ip validate 192.168.1.1` | Validate/detect IP addresses |
| | `mac` | `devknife mac generate` | Generate/validate MAC addresses |

## CLI Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--help` | `-h` | Show help menu |
| `--version` | `-v` | Show version |
| `--interactive` | `-i` | Start interactive mode |
| `--stdin` | `-s` | Read input from stdin |

## Library API

### Grouped Imports

```typescript
import {
  hash, uuid, password, base64, url, jwt, json, text, color, time,
} from 'devknife';

// Hash functions (lazy-loaded)
await hash.md5('hello');
await hash.sha256('hello');

// UUID generator
await uuid.v4();

// Password generator
await password.generate({ length: 32, symbols: true });

// Encoders
await base64.encode('hello');
await url.decode('hello%20world');
await jwt.decode(token);

// Formatters
await json.format('{"a":1}');
await text.camelCase('hello world');

// Converters
await color.hexToRgb('#ff0000');
await time.epochToIso(1672531200);
```

### Direct Imports

```typescript
import {
  // Crypto
  hash, md5, sha1, sha256, sha512, generatePassword,
  // Generators
  generateUUID, generateNanoID, loremWord, loremParagraph,
  // Encoders
  base64Encode, base64Decode, urlEncode, urlDecode,
  htmlEncode, htmlDecode, jwtDecode, isValidJWT,
  // Formatters
  jsonFormat, jsonMinify, jsonValidate,
  camelCase, snakeCase, kebabCase, pascalCase,
  // Converters
  hexToRgb, rgbToHex, rgbToHsl, hslToRgb,
  epochToIso, isoToEpoch, timeAgo, formatDate,
  decimalToBinary, binaryToDecimal, decimalToHex, hexToDecimal,
  // Network
  isValidIPv4, isValidIPv6, getLocalIPs, generateMAC,
} from 'devknife';
```

## Features

- **Zero Dependencies** — Only Node.js native modules
- **50+ Tools** — Everything a developer needs in one package
- **Blazing Fast** — Sub-millisecond execution times
- **Interactive TUI** — Built-in terminal menu using `node:readline`
- **Dual Usage** — CLI tool AND importable TypeScript library
- **STDIN Support** — Pipe data directly: `echo "hello" | devknife base64 encode`
- **100% Library Coverage** — Every library function and branch unit-tested; CLI integration-tested separately
- **TypeScript Strict** — Full type safety with `strict: true`
- **ESM + CJS** — Dual module format for maximum compatibility

## Build

```bash
npm run build        # Build with tsup (ESM + CJS + types)
npm run lint         # Lint with ESLint
npm run format       # Format with Prettier
npm run test         # Run tests
npm run test:coverage  # Run tests with coverage
```

## Publishing

```bash
# Dry run
npm pack

# Publish
npm publish

# With tag
npm publish --tag next
```

## License

MIT © [Avinashvelu03](https://github.com/Avinashvelu03)
