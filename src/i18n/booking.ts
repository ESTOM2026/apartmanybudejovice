import type { Lang } from './ui';

// Single source of truth for the Booking.com listing + static rating.
// Shown visually only (hero badge + reviews section) — intentionally NOT marked up
// as schema.org aggregateRating: Google disallows third-party/aggregator ratings
// in your own business markup.

const LISTING = 'https://www.booking.com/hotel/cz/lets-go-family-apartment-ceske-budejovice';
const SUFFIX: Record<Lang, string> = { cs: 'cs', en: 'en-gb', de: 'de' };

/** Localized URL of our Booking.com profile. */
export function bookingUrl(lang: Lang): string {
  return `${LISTING}.${SUFFIX[lang]}.html`;
}

export const booking = {
  ratingValue: 9.3,
  max: 10,
  /** Decimal formatted per locale (comma for cs/de, dot for en). */
  score: { cs: '9,3', en: '9.3', de: '9,3' } as Record<Lang, string>,
  /** How much of a 5-star bar to fill (9.3 / 10 = 93%). */
  starPercent: 93,
};
