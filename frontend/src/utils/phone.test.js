import test from 'node:test';
import assert from 'node:assert/strict';
import { PHONE_COUNTRIES } from '../data/phoneCountries.js';
import {
  formatPhoneInput,
  validatePhoneForCountry,
  buildE164,
  stripPhoneDigits,
} from './phone.js';

test('formats US numbers as user types', () => {
  const us = PHONE_COUNTRIES.find((c) => c.iso2 === 'US');
  assert.equal(formatPhoneInput('4155552671', us), '(415) 555-2671');
});

test('validates and builds E.164 for US', () => {
  const us = PHONE_COUNTRIES.find((c) => c.iso2 === 'US');
  const result = validatePhoneForCountry('4155552671', us);
  assert.equal(result.valid, true);
  assert.equal(result.e164, '+14155552671');
  assert.match(result.e164, /^\+[1-9]\d{6,14}$/);
});

test('rejects incomplete national numbers', () => {
  const us = PHONE_COUNTRIES.find((c) => c.iso2 === 'US');
  const result = validatePhoneForCountry('41555', us);
  assert.equal(result.valid, false);
  assert.equal(result.e164, null);
});

test('stripPhoneDigits ignores formatting characters', () => {
  assert.equal(stripPhoneDigits('(415) 555-2671'), '4155552671');
  assert.equal(buildE164(stripPhoneDigits('(415) 555-2671'), PHONE_COUNTRIES[0]), '+14155552671');
});
