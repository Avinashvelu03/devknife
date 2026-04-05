import { describe, it, expect } from 'vitest';
import * as color from '../../src/tools/converters/color.js';
import * as time from '../../src/tools/converters/time.js';
import * as number from '../../src/tools/converters/number.js';

describe('converters - color', () => {
  it('hexToRgb', () => {
    expect(color.hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(color.hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(color.hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    expect(color.hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(color.hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('hexToRgb with shorthand', () => {
    expect(color.hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(color.hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
    expect(color.hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('hexToRgb without #', () => {
    expect(color.hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('hexToRgb throws for invalid input', () => {
    expect(() => color.hexToRgb('#gg0000')).toThrow('Invalid HEX');
    expect(() => color.hexToRgb('#ff00')).toThrow('Invalid HEX');
    expect(() => color.hexToRgb('')).toThrow('Invalid HEX');
  });

  it('rgbToHex', () => {
    expect(color.rgbToHex(255, 0, 0)).toBe('#ff0000');
    expect(color.rgbToHex(0, 255, 0)).toBe('#00ff00');
    expect(color.rgbToHex(0, 0, 255)).toBe('#0000ff');
  });

  it('rgbToHex clamps values', () => {
    expect(color.rgbToHex(300, -10, 128)).toBe('#ff0080');
  });

  it('rgbToHsl', () => {
    // Pure red
    expect(color.rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
    // Pure green
    expect(color.rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
    // Pure blue
    expect(color.rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
    // White
    expect(color.rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
    // Black
    expect(color.rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
  });

  it('hslToRgb', () => {
    expect(color.hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
    expect(color.hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
    expect(color.hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
    expect(color.hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
    expect(color.hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('hslToRgb gray (s=0)', () => {
    const result = color.hslToRgb(0, 0, 50);
    expect(result.r).toBe(result.g);
    expect(result.g).toBe(result.b);
    expect(result.r).toBe(128);
  });

  it('rgbToHsl with l > 0.5', () => {
    const result = color.rgbToHsl(200, 200, 240);
    expect(result.l).toBeGreaterThan(50);
  });

  it('rgbToHsl green channel max (gn > bn branch)', () => {
    const result = color.rgbToHsl(0, 200, 50);
    expect(result.h).toBeGreaterThan(60);
    expect(result.h).toBeLessThan(180);
  });

  it('rgbToHsl blue channel max (bn > gn)', () => {
    const result = color.rgbToHsl(50, 100, 200);
    expect(result.h).toBeGreaterThan(180);
    expect(result.h).toBeLessThan(270);
  });

  it('rgbToHsl red max with green < blue (gn < bn ? 6 : 0 true branch)', () => {
    // red=255 is max, green=50 < blue=200
    const result = color.rgbToHsl(255, 50, 200);
    expect(result.h).toBeGreaterThan(270);
    expect(result.h).toBeLessThanOrEqual(360);
  });

  it('rgbToHsl red max with green >= blue (gn < bn ? 6 : 0 false branch)', () => {
    // red=255 is max, green=200 >= blue=100
    const result = color.rgbToHsl(255, 200, 100);
    expect(result.h).toBeGreaterThanOrEqual(0);
    expect(result.h).toBeLessThan(60);
  });

  it('hslToRgb covers various hue branches', () => {
    expect(color.hslToRgb(30, 100, 50)).toEqual(expect.objectContaining({ b: 0 }));
    expect(color.hslToRgb(350, 100, 50)).toEqual(expect.objectContaining({ r: expect.any(Number) }));
    expect(color.hslToRgb(90, 80, 40)).toBeDefined();
    expect(color.hslToRgb(270, 80, 60)).toBeDefined();
  });

  it('hexToHsl', () => {
    expect(color.hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('hslToHex', () => {
    expect(color.hslToHex(0, 100, 50)).toBe('#ff0000');
  });

  it('isValidHex', () => {
    expect(color.isValidHex('#ff0000')).toBe(true);
    expect(color.isValidHex('ff0000')).toBe(true);
    expect(color.isValidHex('#f00')).toBe(true);
    expect(color.isValidHex('f00')).toBe(true);
    expect(color.isValidHex('#gg0000')).toBe(false);
    expect(color.isValidHex('')).toBe(false);
  });

  it('isLightColor', () => {
    expect(color.isLightColor('#ffffff')).toBe(true);
    expect(color.isLightColor('#000000')).toBe(false);
    expect(color.isLightColor('#ff0000')).toBe(false);
    expect(color.isLightColor('#cccccc')).toBe(true);
  });

  it('rgbToCSS', () => {
    expect(color.rgbToCSS(255, 0, 0)).toBe('rgb(255, 0, 0)');
  });

  it('hslToCSS', () => {
    expect(color.hslToCSS(180, 50, 50)).toBe('hsl(180, 50%, 50%)');
  });
});

describe('converters - time', () => {
  it('epochToIso', () => {
    expect(time.epochToIso(0)).toBe('1970-01-01T00:00:00.000Z');
    expect(time.epochToIso(1672531200)).toBe('2023-01-01T00:00:00.000Z');
  });

  it('isoToEpoch', () => {
    expect(time.isoToEpoch('1970-01-01T00:00:00.000Z')).toBe(0);
    expect(time.isoToEpoch('2023-01-01T00:00:00.000Z')).toBe(1672531200);
  });

  it('isoToEpoch throws for invalid date', () => {
    expect(() => time.isoToEpoch('not a date')).toThrow('Invalid ISO date string');
  });

  it('epochToLocale', () => {
    const result = time.epochToLocale(0);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('epochToLocale with timezone', () => {
    const result = time.epochToLocale(1672531200, 'UTC');
    expect(typeof result).toBe('string');
  });

  it('nowEpoch', () => {
    const now = time.nowEpoch();
    expect(typeof now).toBe('number');
    expect(now).toBeGreaterThan(1700000000);
  });

  it('nowIso', () => {
    const now = time.nowIso();
    expect(typeof now).toBe('string');
    expect(now.endsWith('Z')).toBe(true);
  });

  it('msToSeconds', () => {
    expect(time.msToSeconds(1500)).toBe(1);
    expect(time.msToSeconds(0)).toBe(0);
  });

  it('secondsToMs', () => {
    expect(time.secondsToMs(1)).toBe(1000);
    expect(time.secondsToMs(0)).toBe(0);
  });

  it('timeAgo - past', () => {
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
    expect(time.timeAgo(fiveMinutesAgo)).toContain('ago');
  });

  it('timeAgo - future', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    expect(time.timeAgo(future)).toBe('in the future');
  });

  it('timeAgo - just now', () => {
    const now = time.nowEpoch();
    expect(time.timeAgo(now)).toBe('just now');
  });

  it('timeAgo - 1 second ago (singular form)', () => {
    const epoch = Math.floor(Date.now() / 1000) - 1;
    const result = time.timeAgo(epoch);
    expect(result).toMatch(/1 second ago/);
  });

  it('isValidIsoDate', () => {
    expect(time.isValidIsoDate('2023-01-01T00:00:00.000Z')).toBe(true);
    expect(time.isValidIsoDate('invalid')).toBe(false);
  });

  it('getDaysBetween', () => {
    expect(time.getDaysBetween('2023-01-01', '2023-01-31')).toBe(30);
    expect(time.getDaysBetween('2023-01-01', '2023-01-01')).toBe(0);
  });

  it('getDaysBetween throws for invalid dates', () => {
    expect(() => time.getDaysBetween('invalid', '2023-01-01')).toThrow('Invalid date string');
  });

  it('formatDate', () => {
    // Use local date (no Z suffix) to avoid timezone conversion issues
    expect(time.formatDate('2023-01-15T10:30:45', 'YYYY-MM-DD')).toBe('2023-01-15');
    expect(time.formatDate('2023-01-15T10:30:45', 'HH:mm:ss')).toBe('10:30:45');
  });

  it('formatDate throws for invalid date', () => {
    expect(() => time.formatDate('invalid', 'YYYY')).toThrow('Invalid date string');
  });

  it('getWeekNumber', () => {
    // Jan 1 2023 was a Sunday -> week 52/53 of previous year
    const week = time.getWeekNumber('2023-01-02T00:00:00.000Z');
    expect(typeof week).toBe('number');
    expect(week).toBeGreaterThan(0);
    expect(week).toBeLessThanOrEqual(53);
  });

  it('getWeekNumber for a Sunday (day 0 -> || 7 branch)', () => {
    const week = time.getWeekNumber('2023-01-01T12:00:00.000Z');
    expect(typeof week).toBe('number');
    expect(week).toBeGreaterThanOrEqual(1);
  });

  it('getWeekNumber throws for invalid date', () => {
    expect(() => time.getWeekNumber('invalid')).toThrow('Invalid date string');
  });

  it('isLeapYear', () => {
    expect(time.isLeapYear(2024)).toBe(true);
    expect(time.isLeapYear(2023)).toBe(false);
    expect(time.isLeapYear(2000)).toBe(true);
    expect(time.isLeapYear(1900)).toBe(false);
  });
});

describe('converters - number', () => {
  it('decimalToBinary', () => {
    expect(number.decimalToBinary(0)).toBe('0');
    expect(number.decimalToBinary(42)).toBe('101010');
    expect(number.decimalToBinary(255)).toBe('11111111');
  });

  it('binaryToDecimal', () => {
    expect(number.binaryToDecimal('0')).toBe(0);
    expect(number.binaryToDecimal('101010')).toBe(42);
    expect(number.binaryToDecimal('11111111')).toBe(255);
  });

  it('binaryToDecimal throws for invalid', () => {
    expect(() => number.binaryToDecimal('123')).toThrow('Invalid binary string');
  });

  it('decimalToHex', () => {
    expect(number.decimalToHex(0)).toBe('0');
    expect(number.decimalToHex(255)).toBe('ff');
    expect(number.decimalToHex(16)).toBe('10');
  });

  it('hexToDecimal', () => {
    expect(number.hexToDecimal('0')).toBe(0);
    expect(number.hexToDecimal('ff')).toBe(255);
    expect(number.hexToDecimal('10')).toBe(16);
  });

  it('hexToDecimal throws for invalid', () => {
    expect(() => number.hexToDecimal('xyz')).toThrow('Invalid hexadecimal string');
  });

  it('decimalToOctal', () => {
    expect(number.decimalToOctal(0)).toBe(0);
    expect(number.decimalToOctal(8)).toBe(10);
    expect(number.decimalToOctal(64)).toBe(100);
  });

  it('decimalToOctal throws for non-integer', () => {
    expect(() => number.decimalToOctal(3.14)).toThrow('Input must be an integer');
  });

  it('octalToDecimal', () => {
    expect(number.octalToDecimal('0')).toBe(0);
    expect(number.octalToDecimal('10')).toBe(8);
    expect(number.octalToDecimal('100')).toBe(64);
  });

  it('octalToDecimal throws for invalid', () => {
    expect(() => number.octalToDecimal('89')).toThrow('Invalid octal string');
  });

  it('hexToBinary', () => {
    expect(number.hexToBinary('ff')).toBe('11111111');
  });

  it('binaryToHex', () => {
    expect(number.binaryToHex('11111111')).toBe('ff');
  });

  it('toBase', () => {
    expect(number.toBase(255, 2)).toBe('11111111');
    expect(number.toBase(255, 16)).toBe('ff');
    expect(number.toBase(255, 8)).toBe('377');
  });

  it('toBase throws for invalid base', () => {
    expect(() => number.toBase(10, 1)).toThrow('Base must be between 2 and 36');
    expect(() => number.toBase(10, 37)).toThrow('Base must be between 2 and 36');
  });

  it('toBase throws for non-integer', () => {
    expect(() => number.toBase(3.14, 10)).toThrow('Input must be an integer');
  });

  it('fromBase', () => {
    expect(number.fromBase('ff', 16)).toBe(255);
    expect(number.fromBase('11111111', 2)).toBe(255);
  });

  it('fromBase throws for invalid base', () => {
    expect(() => number.fromBase('10', 1)).toThrow('Base must be between 2 and 36');
  });

  it('isBinary', () => {
    expect(number.isBinary('101010')).toBe(true);
    expect(number.isBinary('123')).toBe(false);
    expect(number.isBinary('')).toBe(false);
  });

  it('isHex', () => {
    expect(number.isHex('ff')).toBe(true);
    expect(number.isHex('FF')).toBe(true);
    expect(number.isHex('xyz')).toBe(false);
    expect(number.isHex('')).toBe(false);
  });

  it('isOctal', () => {
    expect(number.isOctal('777')).toBe(true);
    expect(number.isOctal('889')).toBe(false);
    expect(number.isOctal('')).toBe(false);
  });

  it('formatBytes', () => {
    expect(number.formatBytes(0)).toBe('0 Bytes');
    expect(number.formatBytes(1024)).toBe('1 KB');
    expect(number.formatBytes(1048576)).toBe('1 MB');
    expect(number.formatBytes(1073741824)).toBe('1 GB');
  });

  it('formatBytes throws for negative', () => {
    expect(() => number.formatBytes(-1)).toThrow('Bytes cannot be negative');
  });

  it('formatBytes with very large number (hits ?? fallback)', () => {
    const result = number.formatBytes(Number.MAX_SAFE_INTEGER);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('decimalToBinary throws for non-integer', () => {
    expect(() => number.decimalToBinary(3.14)).toThrow('Input must be an integer');
  });

  it('decimalToHex throws for non-integer', () => {
    expect(() => number.decimalToHex(3.14)).toThrow('Input must be an integer');
  });
});
