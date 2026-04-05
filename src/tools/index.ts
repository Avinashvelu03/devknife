/**
 * devknife - Tools index
 * Re-exports all tool modules.
 */

// Crypto
export { hash, md5, sha1, sha256, sha512, isSupportedAlgorithm, getSupportedAlgorithms, hashFile } from './crypto/hash.js';
export type { HashAlgorithm } from './crypto/hash.js';
export { generatePassword, calculateEntropy, estimateStrength } from './crypto/password.js';
export type { PasswordOptions } from './crypto/password.js';

// Generators
export { generateUUID, isValidUUID, generateUUIDs } from './generators/uuid.js';
export { generateNanoID, isNanoIDValid, generateNanoIDs } from './generators/nanoid.js';
export type { NanoIDOptions } from './generators/nanoid.js';
export { word as loremWord, sentence as loremSentence, paragraph as loremParagraph, paragraphs as loremParagraphs, title as loremTitle } from './generators/lorem.js';

// Encoders
export { encode as base64Encode, decode as base64Decode, isBase64, encodeURLSafe as base64EncodeURLSafe, decodeURLSafe as base64DecodeURLSafe } from './encoders/base64.js';
export { encode as urlEncode, decode as urlDecode, encodeComponent as urlEncodeComponent, decodeComponent as urlDecodeComponent, isValidEncoded } from './encoders/url.js';
export { encode as htmlEncode, decode as htmlDecode, encodeAttribute as htmlEncodeAttribute, stripTags } from './encoders/html.js';
export { decode as jwtDecode, isExpired as jwtIsExpired, isValidJWT, getIssuer as jwtGetIssuer, getSubject as jwtGetSubject, getExpiration as jwtGetExpiration } from './encoders/jwt.js';
export type { JWTHeader, JWTPayload, JWTDecodeResult, JWTExpired } from './encoders/jwt.js';

// Formatters
export { format as jsonFormat, minify as jsonMinify, validate as jsonValidate, sortByKeys as jsonSortByKeys, flatten as jsonFlatten, prettyStringify } from './formatters/json.js';
export { camelCase, snakeCase, kebabCase, pascalCase, constantCase, dotCase, titleCase, sentenceCase, upperCase, lowerCase, reverseCase, slugify } from './formatters/text.js';

// Converters
export { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, hexToHsl, hslToHex, isValidHex, isLightColor, rgbToCSS, hslToCSS } from './converters/color.js';
export type { RGB, HSL } from './converters/color.js';
export { epochToIso, isoToEpoch, epochToLocale, nowEpoch, nowIso, msToSeconds, secondsToMs, timeAgo, isValidIsoDate, getDaysBetween, formatDate, getWeekNumber, isLeapYear } from './converters/time.js';
export { decimalToBinary, binaryToDecimal, decimalToHex, hexToDecimal, decimalToOctal, octalToDecimal, hexToBinary, binaryToHex, toBase, fromBase, isBinary, isHex, isOctal, formatBytes } from './converters/number.js';

// Network
export { isValidIPv4, isValidIPv6, isValidIP, getLocalIPs, getLocalIPv4, isPrivateIP, isReservedIP, getHostname } from './network/ip.js';
export { isValidMAC, generateMAC, normalizeMAC, macToHex } from './network/mac.js';
