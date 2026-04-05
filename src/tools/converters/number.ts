/**
 * Number base conversions: Binary/Hex/Octal/Decimal.
 * Zero-dependency.
 */

export function decimalToBinary(decimal: number): string {
  if (!Number.isInteger(decimal)) throw new Error('Input must be an integer');
  return decimal.toString(2);
}

export function binaryToDecimal(binary: string): number {
  if (!/^[01]+$/.test(binary)) throw new Error('Invalid binary string');
  return parseInt(binary, 2);
}

export function decimalToHex(decimal: number): string {
  if (!Number.isInteger(decimal)) throw new Error('Input must be an integer');
  return decimal.toString(16);
}

export function hexToDecimal(hex: string): number {
  if (!/^[0-9a-fA-F]+$/.test(hex)) throw new Error('Invalid hexadecimal string');
  return parseInt(hex, 16);
}

export function decimalToOctal(decimal: number): number {
  if (!Number.isInteger(decimal)) throw new Error('Input must be an integer');
  return parseInt(decimal.toString(8), 10);
}

export function octalToDecimal(octal: string): number {
  if (!/^[0-7]+$/.test(octal)) throw new Error('Invalid octal string');
  return parseInt(octal, 8);
}

export function hexToBinary(hex: string): string {
  const decimal = hexToDecimal(hex);
  return decimalToBinary(decimal);
}

export function binaryToHex(binary: string): string {
  const decimal = binaryToDecimal(binary);
  return decimalToHex(decimal);
}

export function toBase(num: number, base: number): string {
  if (base < 2 || base > 36) throw new Error('Base must be between 2 and 36');
  if (!Number.isInteger(num)) throw new Error('Input must be an integer');
  return num.toString(base);
}

export function fromBase(str: string, base: number): number {
  if (base < 2 || base > 36) throw new Error('Base must be between 2 and 36');
  return parseInt(str, base);
}

export function isBinary(str: string): boolean {
  return /^[01]+$/.test(str);
}

export function isHex(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str);
}

export function isOctal(str: string): boolean {
  return /^[0-7]+$/.test(str);
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 0) throw new Error('Bytes cannot be negative');
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  const sizeStr = sizes[i]!;
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizeStr}`;
}
