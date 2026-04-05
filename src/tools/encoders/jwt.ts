/**
 * JWT decoder (header/payload parsing).
 * Zero-dependency, uses Node Buffer.
 */

export interface JWTHeader {
  alg?: string;
  typ?: string;
  [key: string]: unknown;
}

export interface JWTPayload {
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface JWTDecodeResult {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
}

export interface JWTExpired {
  expired: boolean;
  expiresAt: Date | null;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

export function decode(token: string): JWTDecodeResult {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT: token must have 3 parts separated by dots');
  }

  const [headerB64, payloadB64, signature] = parts;

  let header: JWTHeader;
  let payload: JWTPayload;

  try {
    header = JSON.parse(base64UrlDecode(headerB64!)) as JWTHeader;
  } catch {
    throw new Error('Invalid JWT: header is not valid JSON');
  }

  try {
    payload = JSON.parse(base64UrlDecode(payloadB64!)) as JWTPayload;
  } catch {
    throw new Error('Invalid JWT: payload is not valid JSON');
  }

  return {
    header,
    payload,
    signature: signature as string,
  };
}

export function isExpired(token: string): JWTExpired {
  try {
    const { payload } = decode(token);
    if (payload.exp == null) {
      return { expired: false, expiresAt: null };
    }
    const now = Math.floor(Date.now() / 1000);
    const expired = payload.exp < now;
    return {
      expired,
      expiresAt: new Date(payload.exp * 1000),
    };
  } catch {
    return { expired: false, expiresAt: null };
  }
}

export function isValidJWT(token: string): boolean {
  if (token.split('.').length !== 3) return false;
  try {
    decode(token);
    return true;
  } catch {
    return false;
  }
}

export function getIssuer(token: string): string | null {
  try {
    const { payload } = decode(token);
    return payload.iss != null ? (payload.iss as string) : null;
  } catch {
    return null;
  }
}

export function getSubject(token: string): string | null {
  try {
    const { payload } = decode(token);
    return payload.sub != null ? (payload.sub as string) : null;
  } catch {
    return null;
  }
}

export function getExpiration(token: string): Date | null {
  try {
    const { payload } = decode(token);
    if (payload.exp == null) return null;
    return new Date(payload.exp * 1000);
  } catch {
    return null;
  }
}
