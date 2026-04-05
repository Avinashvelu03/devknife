import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NetworkInterfaceInfo } from 'node:os';
import * as ip from '../../src/tools/network/ip.js';
import * as mac from '../../src/tools/network/mac.js';

// Mock os module
const mockNetworkInterfaces = vi.fn(() => ({}));
vi.mock('node:os', async () => {
  const actual = await vi.importActual('node:os');
  return {
    ...actual,
    networkInterfaces: (...args: unknown[]) => mockNetworkInterfaces(...args),
  };
});

describe('network - ip', () => {
  it('isValidIPv4', () => {
    expect(ip.isValidIPv4('192.168.1.1')).toBe(true);
    expect(ip.isValidIPv4('0.0.0.0')).toBe(true);
    expect(ip.isValidIPv4('255.255.255.255')).toBe(true);
    expect(ip.isValidIPv4('256.1.1.1')).toBe(false);
    expect(ip.isValidIPv4('1.1.1')).toBe(false);
    expect(ip.isValidIPv4('')).toBe(false);
    expect(ip.isValidIPv4('not an ip')).toBe(false);
    expect(ip.isValidIPv4('abc')).toBe(false);
  });

  it('isValidIPv6 - full format', () => {
    expect(ip.isValidIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
    expect(ip.isValidIPv6('0000:0000:0000:0000:0000:0000:0000:0000')).toBe(true);
  });

  it('isValidIPv6 - shorthand with ::', () => {
    expect(ip.isValidIPv6('2001:db8::1')).toBe(true);
    expect(ip.isValidIPv6('::1')).toBe(true);
    expect(ip.isValidIPv6('2001::db8:1')).toBe(true);
  });

  it('isValidIPv6 - invalid', () => {
    expect(ip.isValidIPv6('not:valid:ipv6')).toBe(false);
    expect(ip.isValidIPv6('')).toBe(false);
    expect(ip.isValidIPv6(':::')).toBe(false);
    expect(ip.isValidIPv6('1::2::3')).toBe(false);
  });

  it('isValidIP - IPv4', () => {
    expect(ip.isValidIP('192.168.1.1')).toBe(true);
  });

  it('isValidIP - IPv6', () => {
    expect(ip.isValidIP('::1')).toBe(true);
    expect(ip.isValidIP('2001:db8::1')).toBe(true);
  });

  it('isValidIP - invalid', () => {
    expect(ip.isValidIP('not valid')).toBe(false);
  });

  it('getLocalIPs returns array', () => {
    const ips = ip.getLocalIPs();
    expect(Array.isArray(ips)).toBe(true);
    ips.forEach((addr) => {
      expect(typeof addr).toBe('string');
    });
  });

  it('getLocalIPv4 returns string or null', () => {
    const result = ip.getLocalIPv4();
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('isPrivateIP', () => {
    expect(ip.isPrivateIP('10.0.0.1')).toBe(true);
    expect(ip.isPrivateIP('172.16.0.1')).toBe(true);
    expect(ip.isPrivateIP('172.31.255.255')).toBe(true);
    expect(ip.isPrivateIP('192.168.1.1')).toBe(true);
    expect(ip.isPrivateIP('127.0.0.1')).toBe(true);
    expect(ip.isPrivateIP('8.8.8.8')).toBe(false);
    expect(ip.isPrivateIP('172.15.0.1')).toBe(false);
    expect(ip.isPrivateIP('172.32.0.1')).toBe(false);
  });

  it('isPrivateIP returns false for invalid IP', () => {
    expect(ip.isPrivateIP('not valid')).toBe(false);
  });

  it('isReservedIP', () => {
    expect(ip.isReservedIP('0.0.0.0')).toBe(true);
    expect(ip.isReservedIP('127.0.0.1')).toBe(true);
    expect(ip.isReservedIP('169.254.1.1')).toBe(true);
    expect(ip.isReservedIP('224.0.0.1')).toBe(true);
    expect(ip.isReservedIP('192.168.1.1')).toBe(false);
  });

  it('isReservedIP returns false for invalid IP', () => {
    expect(ip.isReservedIP('not valid')).toBe(false);
  });

  it('getHostname returns string', () => {
    const hostname = ip.getHostname();
    expect(typeof hostname).toBe('string');
    expect(hostname.length).toBeGreaterThan(0);
  });
});

describe('network - ip mocked', () => {
  beforeEach(() => {
    mockNetworkInterfaces.mockReset();
  });

  it('getLocalIPs with interface returning undefined (iface === undefined branch)', () => {
    mockNetworkInterfaces.mockReturnValue({ lo: undefined } as Record<string, NetworkInterfaceInfo[] | undefined>);
    const ips = ip.getLocalIPs();
    expect(ips).toEqual([]);
  });

  it('getLocalIPv4 returns null when no local IPs', () => {
    mockNetworkInterfaces.mockReturnValue({});
    const result = ip.getLocalIPv4();
    expect(result).toBeNull();
  });

  it('getLocalIPs filters out internal addresses', () => {
    mockNetworkInterfaces.mockReturnValue({
      lo: [{ address: '127.0.0.1', family: 'IPv4', internal: true, netmask: '255.0.0.0', mac: '00:00:00:00:00:00', cidr: '127.0.0.1/8' }],
      eth0: [{ address: '192.168.1.1', family: 'IPv4', internal: false, netmask: '255.255.255.0', mac: 'aa:bb:cc:dd:ee:ff', cidr: '192.168.1.1/24' }],
    } as Record<string, NetworkInterfaceInfo[]>);
    const ips = ip.getLocalIPs();
    expect(ips).toEqual(['192.168.1.1']);
  });
});

describe('network - mac', () => {
  it('isValidMAC', () => {
    expect(mac.isValidMAC('00:1A:2B:3C:4D:5E')).toBe(true);
    expect(mac.isValidMAC('00-1A-2B-3C-4D-5E')).toBe(true);
    expect(mac.isValidMAC('00:1A:2B:3C:4D')).toBe(false);
    expect(mac.isValidMAC('')).toBe(false);
    expect(mac.isValidMAC('not a mac')).toBe(false);
  });

  it('generateMAC with default separator', () => {
    const addr = mac.generateMAC();
    expect(addr).toMatch(/^[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}$/);
  });

  it('generateMAC with custom separator', () => {
    const addr = mac.generateMAC('-');
    expect(addr).toMatch(/^[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}$/);
  });

  it('generateMAC produces unique values', () => {
    const addrs = new Set(Array.from({ length: 100 }, () => mac.generateMAC()));
    expect(addrs.size).toBe(100);
  });

  it('normalizeMAC', () => {
    expect(mac.normalizeMAC('00:1A:2B:3C:4D:5E', '-')).toBe('00-1A-2B-3C-4D-5E');
    expect(mac.normalizeMAC('00-1A-2B-3C-4D-5E', ':')).toBe('00:1A:2B:3C:4D:5E');
    expect(mac.normalizeMAC('00:1a:2b:3c:4d:5e')).toBe('00:1A:2B:3C:4D:5E');
  });

  it('normalizeMAC throws for invalid length', () => {
    expect(() => mac.normalizeMAC('00:1A:2B')).toThrow('Invalid MAC address length');
  });

  it('macToHex', () => {
    expect(mac.macToHex('00:1A:2B:3C:4D:5E')).toBe('0x001a2b3c4d5e');
  });

  it('macToHex throws for invalid MAC', () => {
    expect(() => mac.macToHex('invalid')).toThrow('Invalid MAC address');
  });
});
