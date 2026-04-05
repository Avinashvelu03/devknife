/**
 * IP address utilities.
 * Zero-dependency for validation; os module for local IPs.
 */

import * as os from 'node:os';

const IPv4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

export function isValidIPv4(ip: string): boolean {
  return IPv4_REGEX.test(ip);
}

const IPv6_REGEX = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

export function isValidIPv6(ip: string): boolean {
  // Also handle :: shorthand
  if (ip.includes('::')) {
    const parts = ip.split('::');
    if (parts.length !== 2) return false;
    const left = parts[0]!.split(':').filter(Boolean);
    const right = parts[1]!.split(':').filter(Boolean);
    return left.length + right.length <= 7 && left.length + right.length >= 1;
  }
  return IPv6_REGEX.test(ip);
}

export function isValidIP(ip: string): boolean {
  return isValidIPv4(ip) || isValidIPv6(ip);
}

export function getLocalIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface === undefined) continue;
    for (const addr of iface) {
      if (addr.family === 'IPv4' && !addr.internal) {
        ips.push(addr.address);
      }
    }
  }
  return ips;
}

export function getLocalIPv4(): string | null {
  const ips = getLocalIPs();
  return ips[0] ?? null;
}

export function isPrivateIP(ip: string): boolean {
  if (!isValidIPv4(ip)) return false;
  const parts = ip.split('.').map(Number);
  return (
    (parts[0] === 10) ||
    (parts[0] === 172 && parts[1]! >= 16 && parts[1]! <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 127)
  );
}

export function isReservedIP(ip: string): boolean {
  if (!isValidIPv4(ip)) return false;
  const parts = ip.split('.').map(Number);
  if (parts[0] === 0) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0]! >= 224) return true;
  return false;
}

export function getHostname(): string {
  return os.hostname();
}
