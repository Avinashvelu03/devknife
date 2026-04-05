/**
 * Time conversions: Epoch <-> ISO <-> relative.
 * Zero-dependency.
 */

export function epochToIso(epoch: number): string {
  return new Date(epoch * 1000).toISOString();
}

export function isoToEpoch(iso: string): number {
  const ms = new Date(iso).getTime();
  if (isNaN(ms)) {
    throw new Error('Invalid ISO date string');
  }
  return Math.floor(ms / 1000);
}

export function epochToLocale(epoch: number, timezone?: string): string {
  const date = new Date(epoch * 1000);
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

export function nowEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export function timeAgo(epoch: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - epoch;

  if (diff < 0) return 'in the future';

  const intervals: [string, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [label, seconds] of intervals) {
    const count = Math.floor(diff / seconds);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

export function isValidIsoDate(str: string): boolean {
  const date = new Date(str);
  return !isNaN(date.getTime());
}

export function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  if (isNaN(d1) || isNaN(d2)) {
    throw new Error('Invalid date string');
  }
  return Math.abs(Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)));
}

export function formatDate(iso: string, format: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) throw new Error('Invalid date string');

  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('DD', String(date.getDate()).padStart(2, '0'))
    .replace('HH', String(date.getHours()).padStart(2, '0'))
    .replace('mm', String(date.getMinutes()).padStart(2, '0'))
    .replace('ss', String(date.getSeconds()).padStart(2, '0'));
}

export function getWeekNumber(iso: string): number {
  const date = new Date(iso);
  if (isNaN(date.getTime())) throw new Error('Invalid date string');
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
