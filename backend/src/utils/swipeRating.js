const RATING_MAP = {
  like: 'LIKE',
  nope: 'PASS',
  pass: 'PASS',
  super_like: 'SUPER_LIKE',
  superlike: 'SUPER_LIKE',
  boost: 'BOOST',
  rewind: 'REWIND',
};

/** Normalize legacy + interaction rating strings to canonical uppercase values. */
export function normalizeRating(rating) {
  if (!rating || typeof rating !== 'string') {
    throw new Error('Invalid rating');
  }
  const key = rating.trim().toLowerCase();
  return RATING_MAP[key] ?? rating.trim().toUpperCase();
}

export function isLikeRating(rating) {
  const normalized = typeof rating === 'string' && rating === rating.toUpperCase()
    ? rating
    : normalizeRating(rating);
  return normalized === 'LIKE' || normalized === 'SUPER_LIKE';
}

export const VALID_SWIPE_ACTIONS = ['LIKE', 'PASS', 'SUPER_LIKE'];
