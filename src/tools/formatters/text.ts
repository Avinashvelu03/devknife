/**
 * String case converter.
 * Zero-dependency.
 */
export function camelCase(input: string): string {
  return input
    .replace(/[-_ \t\r\n]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

export function snakeCase(input: string): string {
  return input
    .replace(/([A-Z])/g, '_$1')
    .replace(/[- \t\r\n]+/g, '_')
    .replace(/^_/, '')
    .toLowerCase();
}

export function kebabCase(input: string): string {
  return input
    .replace(/([A-Z])/g, '-$1')
    .replace(/[_ \t\r\n]+/g, '-')
    .replace(/^-/, '')
    .toLowerCase();
}

export function pascalCase(input: string): string {
  const camel = camelCase(input);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function constantCase(input: string): string {
  return snakeCase(input).toUpperCase();
}

export function dotCase(input: string): string {
  return input
    .replace(/([A-Z])/g, '.$1')
    .replace(/[-_ \t\r\n]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .toLowerCase();
}

export function titleCase(input: string): string {
  return input
    .split(/[-_ \t\r\n]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function sentenceCase(input: string): string {
  const result = input.replace(/[-_ \t\r\n]+/g, ' ').trim();
  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}

export function upperCase(input: string): string {
  return input.toUpperCase();
}

export function lowerCase(input: string): string {
  return input.toLowerCase();
}

export function reverseCase(input: string): string {
  return input
    .split('')
    .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
    .join('');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 \t\r\n_-]/g, '')
    .replace(/[ \t\r\n_-]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
