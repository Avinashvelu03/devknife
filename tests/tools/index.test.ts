import { describe, it, expect } from 'vitest';

// Test all re-exports from tools/index.ts
import {
  hash, md5, sha1, sha256, sha512, isSupportedAlgorithm, getSupportedAlgorithms, hashFile,
} from '../../src/tools/index.js';
import { generatePassword, calculateEntropy, estimateStrength } from '../../src/tools/index.js';
import { generateUUID, isValidUUID, generateUUIDs } from '../../src/tools/index.js';
import { generateNanoID, isNanoIDValid, generateNanoIDs } from '../../src/tools/index.js';
import { loremWord, loremSentence, loremParagraph, loremParagraphs, loremTitle } from '../../src/tools/index.js';
import { base64Encode, base64Decode, isBase64, base64EncodeURLSafe, base64DecodeURLSafe } from '../../src/tools/index.js';
import { urlEncode, urlDecode, urlEncodeComponent, urlDecodeComponent, isValidEncoded } from '../../src/tools/index.js';
import { htmlEncode, htmlDecode, htmlEncodeAttribute, stripTags } from '../../src/tools/index.js';
import { jwtDecode, jwtIsExpired, isValidJWT, jwtGetIssuer, jwtGetSubject, jwtGetExpiration } from '../../src/tools/index.js';
import { jsonFormat, jsonMinify, jsonValidate, jsonSortByKeys, jsonFlatten, prettyStringify } from '../../src/tools/index.js';
import { camelCase, snakeCase, kebabCase, pascalCase, constantCase, dotCase, titleCase, sentenceCase, upperCase, lowerCase, reverseCase, slugify } from '../../src/tools/index.js';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, hexToHsl, hslToHex, isValidHex, isLightColor, rgbToCSS, hslToCSS } from '../../src/tools/index.js';
import { epochToIso, isoToEpoch, epochToLocale, nowEpoch, nowIso, msToSeconds, secondsToMs, timeAgo, isValidIsoDate, getDaysBetween, formatDate, getWeekNumber, isLeapYear } from '../../src/tools/index.js';
import { decimalToBinary, binaryToDecimal, decimalToHex, hexToDecimal, decimalToOctal, octalToDecimal, hexToBinary, binaryToHex, toBase, fromBase, isBinary, isHex, isOctal, formatBytes } from '../../src/tools/index.js';
import { isValidIPv4, isValidIPv6, isValidIP, getLocalIPs, getLocalIPv4, isPrivateIP, isReservedIP, getHostname } from '../../src/tools/index.js';
import { isValidMAC, generateMAC, normalizeMAC, macToHex } from '../../src/tools/index.js';

describe('tools/index - barrel exports', () => {
  it('should export crypto hash functions', () => {
    expect(typeof hash).toBe('function');
    expect(typeof md5).toBe('function');
    expect(typeof sha1).toBe('function');
    expect(typeof sha256).toBe('function');
    expect(typeof sha512).toBe('function');
    expect(typeof isSupportedAlgorithm).toBe('function');
    expect(typeof getSupportedAlgorithms).toBe('function');
    expect(typeof hashFile).toBe('function');
  });

  it('should export password functions', () => {
    expect(typeof generatePassword).toBe('function');
    expect(typeof calculateEntropy).toBe('function');
    expect(typeof estimateStrength).toBe('function');
  });

  it('should export uuid functions', () => {
    expect(typeof generateUUID).toBe('function');
    expect(typeof isValidUUID).toBe('function');
    expect(typeof generateUUIDs).toBe('function');
  });

  it('should export nanoid functions', () => {
    expect(typeof generateNanoID).toBe('function');
    expect(typeof isNanoIDValid).toBe('function');
    expect(typeof generateNanoIDs).toBe('function');
  });

  it('should export lorem functions', () => {
    expect(typeof loremWord).toBe('function');
    expect(typeof loremSentence).toBe('function');
    expect(typeof loremParagraph).toBe('function');
    expect(typeof loremParagraphs).toBe('function');
    expect(typeof loremTitle).toBe('function');
  });

  it('should export base64 functions', () => {
    expect(typeof base64Encode).toBe('function');
    expect(typeof base64Decode).toBe('function');
    expect(typeof isBase64).toBe('function');
    expect(typeof base64EncodeURLSafe).toBe('function');
    expect(typeof base64DecodeURLSafe).toBe('function');
  });

  it('should export url functions', () => {
    expect(typeof urlEncode).toBe('function');
    expect(typeof urlDecode).toBe('function');
    expect(typeof urlEncodeComponent).toBe('function');
    expect(typeof urlDecodeComponent).toBe('function');
    expect(typeof isValidEncoded).toBe('function');
  });

  it('should export html functions', () => {
    expect(typeof htmlEncode).toBe('function');
    expect(typeof htmlDecode).toBe('function');
    expect(typeof htmlEncodeAttribute).toBe('function');
    expect(typeof stripTags).toBe('function');
  });

  it('should export jwt functions', () => {
    expect(typeof jwtDecode).toBe('function');
    expect(typeof jwtIsExpired).toBe('function');
    expect(typeof isValidJWT).toBe('function');
    expect(typeof jwtGetIssuer).toBe('function');
    expect(typeof jwtGetSubject).toBe('function');
    expect(typeof jwtGetExpiration).toBe('function');
  });

  it('should export json functions', () => {
    expect(typeof jsonFormat).toBe('function');
    expect(typeof jsonMinify).toBe('function');
    expect(typeof jsonValidate).toBe('function');
    expect(typeof jsonSortByKeys).toBe('function');
    expect(typeof jsonFlatten).toBe('function');
    expect(typeof prettyStringify).toBe('function');
  });

  it('should export text functions', () => {
    expect(typeof camelCase).toBe('function');
    expect(typeof snakeCase).toBe('function');
    expect(typeof kebabCase).toBe('function');
    expect(typeof pascalCase).toBe('function');
    expect(typeof constantCase).toBe('function');
    expect(typeof dotCase).toBe('function');
    expect(typeof titleCase).toBe('function');
    expect(typeof sentenceCase).toBe('function');
    expect(typeof upperCase).toBe('function');
    expect(typeof lowerCase).toBe('function');
    expect(typeof reverseCase).toBe('function');
    expect(typeof slugify).toBe('function');
  });

  it('should export color functions', () => {
    expect(typeof hexToRgb).toBe('function');
    expect(typeof rgbToHex).toBe('function');
    expect(typeof rgbToHsl).toBe('function');
    expect(typeof hslToRgb).toBe('function');
    expect(typeof hexToHsl).toBe('function');
    expect(typeof hslToHex).toBe('function');
    expect(typeof isValidHex).toBe('function');
    expect(typeof isLightColor).toBe('function');
    expect(typeof rgbToCSS).toBe('function');
    expect(typeof hslToCSS).toBe('function');
  });

  it('should export time functions', () => {
    expect(typeof epochToIso).toBe('function');
    expect(typeof isoToEpoch).toBe('function');
    expect(typeof epochToLocale).toBe('function');
    expect(typeof nowEpoch).toBe('function');
    expect(typeof nowIso).toBe('function');
    expect(typeof msToSeconds).toBe('function');
    expect(typeof secondsToMs).toBe('function');
    expect(typeof timeAgo).toBe('function');
    expect(typeof isValidIsoDate).toBe('function');
    expect(typeof getDaysBetween).toBe('function');
    expect(typeof formatDate).toBe('function');
    expect(typeof getWeekNumber).toBe('function');
    expect(typeof isLeapYear).toBe('function');
  });

  it('should export number functions', () => {
    expect(typeof decimalToBinary).toBe('function');
    expect(typeof binaryToDecimal).toBe('function');
    expect(typeof decimalToHex).toBe('function');
    expect(typeof hexToDecimal).toBe('function');
    expect(typeof decimalToOctal).toBe('function');
    expect(typeof octalToDecimal).toBe('function');
    expect(typeof hexToBinary).toBe('function');
    expect(typeof binaryToHex).toBe('function');
    expect(typeof toBase).toBe('function');
    expect(typeof fromBase).toBe('function');
    expect(typeof isBinary).toBe('function');
    expect(typeof isHex).toBe('function');
    expect(typeof isOctal).toBe('function');
    expect(typeof formatBytes).toBe('function');
  });

  it('should export ip functions', () => {
    expect(typeof isValidIPv4).toBe('function');
    expect(typeof isValidIPv6).toBe('function');
    expect(typeof isValidIP).toBe('function');
    expect(typeof getLocalIPs).toBe('function');
    expect(typeof getLocalIPv4).toBe('function');
    expect(typeof isPrivateIP).toBe('function');
    expect(typeof isReservedIP).toBe('function');
    expect(typeof getHostname).toBe('function');
  });

  it('should export mac functions', () => {
    expect(typeof isValidMAC).toBe('function');
    expect(typeof generateMAC).toBe('function');
    expect(typeof normalizeMAC).toBe('function');
    expect(typeof macToHex).toBe('function');
  });

  it('barrel exports should produce correct results', () => {
    // Quick sanity check on some re-exports
    expect(sha256('hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    expect(base64Encode('hello')).toBe('aGVsbG8=');
    expect(camelCase('hello world')).toBe('helloWorld');
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(epochToIso(0)).toBe('1970-01-01T00:00:00.000Z');
  });
});
