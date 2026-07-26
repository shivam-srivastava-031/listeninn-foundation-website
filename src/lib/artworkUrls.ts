// ─────────────────────────────────────────────────────────────────────────────
// Artwork image URLs (hosted on Google Drive).
//
// The illustrations live in Google Drive rather than in the repo. Drive's
// /file/d/<id>/view links are NOT usable as <img> sources (they return an HTML
// viewer page), so we use the public thumbnail endpoint, which serves the raw
// image bytes:
//     https://drive.google.com/thumbnail?id=<FILE_ID>&sz=w1600
//
// To change an image, replace its Drive FILE_ID below (from the share link:
// https://drive.google.com/file/d/<FILE_ID>/view). The file must be shared as
// "Anyone with the link".
//
// NOTE: this endpoint is rate-limited and not a guaranteed CDN; if an image
// ever fails to load, re-hosting in the repo (src/assets/artwork/) is the
// robust fallback.
// ─────────────────────────────────────────────────────────────────────────────

const driveImage = (fileId: string, width = 1600) =>
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;

/** "Community care for all who need it" banner — homepage Community Care band. */
export const COMMUNITY_CARE_IMG = driveImage("1vFnuWLqt0Sb2reaDSM0xzYOpRaR9xM39");

/** Watercolour reading circle — About page story section. */
export const READING_CIRCLE_IMG = driveImage("1dg_bZ-K4K1egT1PnRw0uVbJXiVuYb01F");

/** Vine-wrapped balance scale — Values page. */
export const BALANCE_IN_BLOOM_IMG = driveImage("1OVknn82S9zf1pSKQtaPu62Q6-JEqqzaX");
