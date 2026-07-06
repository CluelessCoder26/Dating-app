import { DEFAULT_PHONE_COUNTRY, findCountryByIso } from '../data/phoneCountries.js';

export const LAST_PHONE_COUNTRY_KEY = 'spark_last_phone_country';

/** Matches backend RegisterSchema phone regex in auth.js */
const E164_REGEX = /^\+[1-9]\d{6,14}$/;

export function stripPhoneDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function formatUsCa(digits) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatIn(digits) {
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function formatUk(digits) {
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function formatBr(digits) {
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatGrouped(digits, size) {
  const parts = [];
  for (let i = 0; i < digits.length; i += size) {
    parts.push(digits.slice(i, i + size));
  }
  return parts.join(' ');
}

/** Format national digits for display as the user types. */
export function formatPhoneInput(digits, country) {
  const d = stripPhoneDigits(digits).slice(0, country.maxLength);
  switch (country.format) {
    case 'us':
      return formatUsCa(d);
    case 'in':
      return formatIn(d);
    case 'uk':
      return formatUk(d);
    case 'br':
      return formatBr(d);
    case 'group2':
      return formatGrouped(d, 2);
    case 'group3':
      return formatGrouped(d, 3);
    case 'group4':
      return formatGrouped(d, 4);
    default:
      return formatGrouped(d, 3);
  }
}

export function buildE164(nationalDigits, country) {
  const digits = stripPhoneDigits(nationalDigits);
  return `${country.dialCode}${digits}`;
}

/** Validate national number for the selected country; returns E.164 when valid. */
export function validatePhoneForCountry(nationalDigits, country) {
  const digits = stripPhoneDigits(nationalDigits);

  if (!digits) {
    return { valid: false, e164: null, message: 'Please enter your mobile number.' };
  }

  if (digits.length < country.minLength || digits.length > country.maxLength) {
    const range =
      country.minLength === country.maxLength
        ? `${country.minLength} digits`
        : `${country.minLength}–${country.maxLength} digits`;
    return {
      valid: false,
      e164: null,
      message: `Enter a valid ${country.name} number (${range}).`,
    };
  }

  const e164 = buildE164(digits, country);
  if (!E164_REGEX.test(e164)) {
    return { valid: false, e164: null, message: 'Please enter a valid international phone number.' };
  }

  return { valid: true, e164, message: null };
}

export function getStoredPhoneCountry() {
  try {
    const iso = localStorage.getItem(LAST_PHONE_COUNTRY_KEY);
    if (iso) {
      const found = findCountryByIso(iso);
      if (found) return found;
    }
  } catch {
    /* private browsing / blocked storage */
  }
  return DEFAULT_PHONE_COUNTRY;
}

export function persistPhoneCountry(country) {
  try {
    localStorage.setItem(LAST_PHONE_COUNTRY_KEY, country.iso2);
  } catch {
    /* ignore */
  }
}

/** Align with backend RegisterSchema password rules (auth.js). */
export function validateRegisterPassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  return null;
}
