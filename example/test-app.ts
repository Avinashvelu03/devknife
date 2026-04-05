/**
 * Example Application - Testing devknife library
 * 
 * This example demonstrates real-world usage of devknife
 * by testing various utility functions.
 */

import {
  uuid,
  password,
  base64,
  url,
  jwt,
  hash,
  json,
  text,
  color,
  time,
} from '../dist/index.js';

async function runTests() {
  console.log('========================================');
  console.log('  devknife Example Test Application');
  console.log('========================================\n');

  // Test 1: UUID Generation
  console.log('Test 1: UUID Generation');
  console.log('-----------------------');
  const uuid1 = await uuid.v4();
  const uuid2 = await uuid.v4();
  console.log('✅ UUID v4:', uuid1);
  console.log('✅ UUID v4 (another):', uuid2);
  console.log('✅ Are unique:', uuid1 !== uuid2, '\n');

  // Test 2: Password Generator
  console.log('Test 2: Password Generator');
  console.log('---------------------------');
  const pwd = await password.generate({ length: 16, numbers: true, symbols: true });
  console.log('✅ Generated password:', pwd);
  console.log('✅ Length:', pwd.length, '\n');

  // Test 3: Base64 Encoding
  console.log('Test 3: Base64 Encoding');
  console.log('------------------------');
  const original = 'Hello, devknife!';
  const encoded = await base64.encode(original);
  const decoded = await base64.decode(encoded);
  console.log('✅ Original:', original);
  console.log('✅ Base64 encoded:', encoded);
  console.log('✅ Base64 decoded:', decoded);
  console.log('✅ Round-trip works:', original === decoded, '\n');

  // Test 4: URL Encoding
  console.log('Test 4: URL Encoding');
  console.log('---------------------');
  const urlString = 'https://example.com/search?q=hello world&foo=bar';
  const urlEncoded = await url.encode(urlString);
  const urlDecoded = await url.decode(urlEncoded);
  console.log('✅ URL encode:', urlEncoded);
  console.log('✅ URL decode:', urlDecoded);
  console.log('✅ Round-trip works:', urlString === urlDecoded, '\n');

  // Test 5: JWT Decoder
  console.log('Test 5: JWT Decoder');
  console.log('--------------------');
  const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const decodedJWT = await jwt.decode(sampleJWT);
  console.log('✅ JWT decoded:', JSON.stringify(decodedJWT, null, 2), '\n');

  // Test 6: Hash Functions
  console.log('Test 6: Hash Functions');
  console.log('-----------------------');
  const data = 'test data';
  console.log('✅ MD5:', await hash.md5(data));
  console.log('✅ SHA1:', await hash.sha1(data));
  console.log('✅ SHA256:', await hash.sha256(data));
  console.log('✅ SHA512:', await hash.sha512(data), '\n');

  // Test 7: JSON Formatter
  console.log('Test 7: JSON Formatter');
  console.log('-----------------------');
  const obj = { name: 'devknife', features: ['uuid', 'hash', 'jwt'], version: 1 };
  const jsonString = JSON.stringify(obj);
  const minified = await json.minify(jsonString);
  console.log('✅ Minified JSON:', minified);
  const formatted = await json.format(jsonString);
  console.log('✅ Pretty JSON:');
  console.log(formatted);
  console.log(); // newline

  // Test 8: Text Utilities
  console.log('Test 8: Text Utilities');
  console.log('-----------------------');
  const sampleText = 'hello-world-example';
  console.log('✅ Original:', sampleText);
  console.log('✅ Camel case:', await text.camelCase(sampleText));
  console.log('✅ Snake case:', await text.snakeCase(sampleText));
  console.log('✅ Kebab case:', await text.kebabCase(sampleText));
  console.log('✅ Pascal case:', await text.pascalCase(sampleText), '\n');

  // Test 9: Color Converters
  console.log('Test 9: Color Converters');
  console.log('--------------------------');
  const hexColor = '#ff5733';
  console.log('✅ HEX:', hexColor);
  const rgb = await color.hexToRgb(hexColor);
  console.log('✅ HEX to RGB:', JSON.stringify(rgb));
  const hexBack = await color.rgbToHex(rgb.r, rgb.g, rgb.b);
  console.log('✅ RGB back to HEX:', hexBack);
  console.log('✅ Round-trip works:', hexColor.toLowerCase() === hexBack.toLowerCase(), '\n');

  // Test 10: Time Utilities
  console.log('Test 10: Time Utilities');
  console.log('------------------------');
  const now = Date.now();
  const isoString = new Date(now).toISOString();
  console.log('✅ Current timestamp:', now);
  console.log('✅ Current ISO:', isoString);
  console.log('✅ ISO to epoch:', await time.isoToEpoch(isoString));
  console.log('✅ Epoch to ISO:', await time.epochToIso(now), '\n');

  // Summary
  console.log('========================================');
  console.log('  All Tests Completed Successfully!');
  console.log('========================================');
  console.log('\ndevknife is working correctly!');
  console.log('Features tested:');
  console.log('  - UUID v4 generation');
  console.log('  - Password generation');
  console.log('  - Base64 encoding/decoding');
  console.log('  - URL encoding/decoding');
  console.log('  - JWT decoding');
  console.log('  - Hash functions (MD5, SHA1, SHA256, SHA512)');
  console.log('  - JSON formatting & minification');
  console.log('  - Text case conversions (camel, snake, kebab, pascal)');
  console.log('  - Color converters (HEX/RGB)');
  console.log('  - Time utilities (epoch/ISO conversion)');
}

runTests().catch(console.error);
