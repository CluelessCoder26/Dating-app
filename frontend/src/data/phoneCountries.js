/** Country metadata for phone input — iso2 is used for flags and localStorage preference. */
export const PHONE_COUNTRIES = [
  { iso2: 'US', name: 'United States', dialCode: '+1', minLength: 10, maxLength: 10, format: 'us' },
  { iso2: 'CA', name: 'Canada', dialCode: '+1', minLength: 10, maxLength: 10, format: 'us' },
  { iso2: 'GB', name: 'United Kingdom', dialCode: '+44', minLength: 10, maxLength: 10, format: 'uk' },
  { iso2: 'IN', name: 'India', dialCode: '+91', minLength: 10, maxLength: 10, format: 'in' },
  { iso2: 'AU', name: 'Australia', dialCode: '+61', minLength: 9, maxLength: 9, format: 'group4' },
  { iso2: 'JP', name: 'Japan', dialCode: '+81', minLength: 10, maxLength: 10, format: 'group4' },
  { iso2: 'DE', name: 'Germany', dialCode: '+49', minLength: 10, maxLength: 11, format: 'group3' },
  { iso2: 'FR', name: 'France', dialCode: '+33', minLength: 9, maxLength: 9, format: 'group2' },
  { iso2: 'CN', name: 'China', dialCode: '+86', minLength: 11, maxLength: 11, format: 'group4' },
  { iso2: 'BR', name: 'Brazil', dialCode: '+55', minLength: 10, maxLength: 11, format: 'br' },
  { iso2: 'MX', name: 'Mexico', dialCode: '+52', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'AE', name: 'United Arab Emirates', dialCode: '+971', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'ZA', name: 'South Africa', dialCode: '+27', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'IT', name: 'Italy', dialCode: '+39', minLength: 9, maxLength: 10, format: 'group3' },
  { iso2: 'ES', name: 'Spain', dialCode: '+34', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'KR', name: 'South Korea', dialCode: '+82', minLength: 9, maxLength: 10, format: 'group4' },
  { iso2: 'RU', name: 'Russia', dialCode: '+7', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'TR', name: 'Turkey', dialCode: '+90', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'SA', name: 'Saudi Arabia', dialCode: '+966', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'AR', name: 'Argentina', dialCode: '+54', minLength: 10, maxLength: 10, format: 'group4' },
  { iso2: 'NG', name: 'Nigeria', dialCode: '+234', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'EG', name: 'Egypt', dialCode: '+20', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'ID', name: 'Indonesia', dialCode: '+62', minLength: 9, maxLength: 11, format: 'group4' },
  { iso2: 'PK', name: 'Pakistan', dialCode: '+92', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'BD', name: 'Bangladesh', dialCode: '+880', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'PH', name: 'Philippines', dialCode: '+63', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'VN', name: 'Vietnam', dialCode: '+84', minLength: 9, maxLength: 10, format: 'group3' },
  { iso2: 'TH', name: 'Thailand', dialCode: '+66', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'MY', name: 'Malaysia', dialCode: '+60', minLength: 9, maxLength: 10, format: 'group3' },
  { iso2: 'SG', name: 'Singapore', dialCode: '+65', minLength: 8, maxLength: 8, format: 'group4' },
  { iso2: 'NZ', name: 'New Zealand', dialCode: '+64', minLength: 8, maxLength: 10, format: 'group3' },
  { iso2: 'SE', name: 'Sweden', dialCode: '+46', minLength: 9, maxLength: 10, format: 'group3' },
  { iso2: 'NO', name: 'Norway', dialCode: '+47', minLength: 8, maxLength: 8, format: 'group3' },
  { iso2: 'FI', name: 'Finland', dialCode: '+358', minLength: 9, maxLength: 10, format: 'group3' },
  { iso2: 'DK', name: 'Denmark', dialCode: '+45', minLength: 8, maxLength: 8, format: 'group4' },
  { iso2: 'NL', name: 'Netherlands', dialCode: '+31', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'BE', name: 'Belgium', dialCode: '+32', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'CH', name: 'Switzerland', dialCode: '+41', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'AT', name: 'Austria', dialCode: '+43', minLength: 10, maxLength: 13, format: 'group3' },
  { iso2: 'IE', name: 'Ireland', dialCode: '+353', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'PL', name: 'Poland', dialCode: '+48', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'PT', name: 'Portugal', dialCode: '+351', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'GR', name: 'Greece', dialCode: '+30', minLength: 10, maxLength: 10, format: 'group3' },
  { iso2: 'IL', name: 'Israel', dialCode: '+972', minLength: 9, maxLength: 9, format: 'group3' },
  { iso2: 'HK', name: 'Hong Kong', dialCode: '+852', minLength: 8, maxLength: 8, format: 'group4' },
  { iso2: 'TW', name: 'Taiwan', dialCode: '+886', minLength: 9, maxLength: 9, format: 'group3' },
];

export const DEFAULT_PHONE_COUNTRY = PHONE_COUNTRIES[0];

export function findCountryByIso(iso2) {
  return PHONE_COUNTRIES.find((c) => c.iso2 === iso2) ?? null;
}

export function searchCountries(query) {
  const q = query.trim().toLowerCase();
  if (!q) return PHONE_COUNTRIES;
  return PHONE_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.iso2.toLowerCase().includes(q) ||
      c.dialCode.includes(q.replace(/\s/g, ''))
  );
}
