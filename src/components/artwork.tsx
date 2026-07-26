/**
 * Hand-drawn line-art illustrations for ListenInn Foundation.
 *
 * These echo the foundation's own artwork style — delicate single-stroke
 * botanical line drawings and soft, human figures — rendered as inline SVG so
 * they scale crisply, adapt to the brand palette, and add no image weight.
 *
 * Strokes use `currentColor`, so set the colour with a Tailwind text-* class on
 * the wrapper (e.g. `text-primary`, `text-accent`). Accent fills use the brand
 * CSS variables directly.
 *
 * To swap in the real hand-drawn images later, drop the files into
 * `src/assets/artwork/` and replace the relevant component's <svg> with an
 * <img src={...} /> — the surrounding layout will still hold.
 */

type ArtProps = {
  className?: string;
};

/* ─────────────── Leafy vine divider ─────────────── */
/* A gently arcing stem with alternating leaves — used to separate sections. */
export function LeafyVine({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 480 60"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* main stem */}
        <path d="M8 34 C 120 6, 360 6, 472 34" />
        {/* leaves along the stem */}
        <path d="M96 20 c -10 -12, -26 -10, -30 2 c 14 6, 26 2, 30 -2 Z" />
        <path d="M168 12 c 4 -14, 20 -16, 26 -6 c -10 10, -22 10, -26 6 Z" />
        <path d="M240 9 c -8 -13, -24 -12, -28 0 c 13 6, 24 3, 28 0 Z" />
        <path d="M312 12 c 6 -14, 22 -14, 26 -4 c -11 9, -22 8, -26 4 Z" />
        <path d="M384 20 c -8 -13, -25 -11, -30 1 c 14 7, 26 3, 30 -1 Z" />
        {/* small bud at the crest */}
        <path d="M240 9 c 0 -8, 0 -8, 0 -8" />
        <circle cx="240" cy="4" r="3.2" fill="var(--accent)" stroke="none" />
      </g>
    </svg>
  );
}

/* ─────────────── Reaching-hands & heart ─────────────── */
/* Two open hands cradling a heart — the core "you are not alone" motif. */
export function ReachingHands({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 170" fill="none" className={className} aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* soft botanical arcs behind */}
        <path d="M40 40 C 70 20, 130 20, 160 40" opacity="0.5" />
        <path d="M56 30 c -6 -10, -18 -9, -22 1 c 10 5, 19 2, 22 -1 Z" opacity="0.5" />
        <path d="M144 30 c 6 -10, 18 -9, 22 1 c -10 5, -19 2, -22 -1 Z" opacity="0.5" />

        {/* left hand */}
        <path d="M20 150 C 30 120, 45 108, 66 104" />
        <path d="M40 150 C 44 128, 52 116, 66 110" />
        <path d="M60 152 C 60 132, 64 120, 72 112" />
        <path d="M18 150 C 30 150, 52 152, 62 152" />

        {/* right hand */}
        <path d="M180 150 C 170 120, 155 108, 134 104" />
        <path d="M160 150 C 156 128, 148 116, 134 110" />
        <path d="M140 152 C 140 132, 136 120, 128 112" />
        <path d="M182 150 C 170 150, 148 152, 138 152" />

        {/* heart cradled between */}
        <path
          d="M100 96 C 92 82, 72 84, 72 100 C 72 114, 92 122, 100 132 C 108 122, 128 114, 128 100 C 128 84, 108 82, 100 96 Z"
          fill="var(--primary)"
          fillOpacity="0.12"
          stroke="var(--primary)"
        />
      </g>
    </svg>
  );
}

/* ─────────────── Community-care banner ─────────────── */
/* Three figures holding hands beneath a banner — "community care for all". */
export function CommunityCareArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 360 240" fill="none" className={className} aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* waving banner */}
        <path d="M70 30 C 150 12, 240 20, 300 34 C 296 78, 300 96, 300 96 C 240 82, 150 74, 74 92 C 72 60, 70 44, 70 30 Z" />
        <path d="M70 30 L 70 150" opacity="0.7" />
        <path d="M300 34 L 300 132" opacity="0.7" />
        <text
          x="185"
          y="52"
          textAnchor="middle"
          fontSize="17"
          fontFamily="var(--font-script)"
          fill="currentColor"
          stroke="none"
        >
          Community care
        </text>
        <text
          x="185"
          y="76"
          textAnchor="middle"
          fontSize="14"
          fontFamily="var(--font-script)"
          fill="currentColor"
          stroke="none"
        >
          for all who need it
        </text>

        {/* three figures holding hands */}
        {/* left figure */}
        <circle cx="110" cy="150" r="13" />
        <path d="M110 163 C 100 174, 98 200, 100 224" />
        <path d="M110 163 C 120 174, 122 200, 120 224" />
        <path d="M110 176 C 128 182, 150 188, 168 196" />

        {/* centre figure */}
        <circle cx="185" cy="146" r="14" />
        <path d="M185 160 C 175 172, 174 200, 176 226" />
        <path d="M185 160 C 195 172, 196 200, 194 226" />
        <path d="M185 174 C 168 182, 152 190, 168 196" />
        <path d="M185 174 C 202 182, 218 190, 202 196" />

        {/* right figure with raised arm */}
        <circle cx="260" cy="150" r="13" />
        <path d="M260 163 C 250 174, 248 200, 250 224" />
        <path d="M260 163 C 270 174, 272 200, 270 224" />
        <path d="M260 176 C 242 182, 220 188, 202 196" />
        <path d="M262 164 C 274 150, 282 132, 286 116" />
      </g>
    </svg>
  );
}

/* ─────────────── Reading / listening circle ─────────────── */
/* A small circle of figures with open books — shared, unhurried presence. */
export function ReadingCircleArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 320 200" fill="none" className={className} aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* soft swirls behind (echoing the watercolour clouds) */}
        <path d="M40 46 c 18 -20, 44 -8, 30 14 c -12 18, -44 10, -30 -14 Z" opacity="0.35" />
        <path d="M250 40 c 20 -18, 46 -4, 30 18 c -14 18, -46 8, -30 -18 Z" opacity="0.35" />

        {/* three seated figures */}
        {[70, 160, 250].map((cx, i) => (
          <g key={cx}>
            <circle cx={cx} cy={i === 1 ? 96 : 104} r="14" />
            {/* shoulders / seated body */}
            <path
              d={`M${cx - 22} 168 C ${cx - 20} 132, ${cx - 10} ${i === 1 ? 112 : 120}, ${cx} ${i === 1 ? 110 : 118}`}
            />
            <path
              d={`M${cx + 22} 168 C ${cx + 20} 132, ${cx + 10} ${i === 1 ? 112 : 120}, ${cx} ${i === 1 ? 110 : 118}`}
            />
            {/* open book on the lap */}
            <path
              d={`M${cx - 20} 150 C ${cx - 8} 144, ${cx - 2} 144, ${cx} 148 C ${cx + 2} 144, ${cx + 8} 144, ${cx + 20} 150 L ${cx + 20} 166 C ${cx + 8} 160, ${cx + 2} 160, ${cx} 164 C ${cx - 2} 160, ${cx - 8} 160, ${cx - 20} 166 Z`}
              fill="var(--accent)"
              fillOpacity="0.1"
            />
            <path d={`M${cx} 148 L ${cx} 164`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ─────────────── Balance in bloom ─────────────── */
/* A vine-wrapped balance scale — fairness and care held in equilibrium. */
export function BalanceVineArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 260 220" fill="none" className={className} aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* central post with climbing vine */}
        <path d="M130 40 L 130 176" />
        <path d="M130 60 c 14 -6, 18 6, 8 12 c -8 4, -14 -4, -8 -12 Z" opacity="0.8" />
        <path d="M130 92 c -14 -6, -18 6, -8 12 c 8 4, 14 -4, 8 -12 Z" opacity="0.8" />
        <path d="M130 124 c 14 -6, 18 6, 8 12 c -8 4, -14 -4, -8 -12 Z" opacity="0.8" />

        {/* beam (gently arced) with leaves */}
        <path d="M40 60 C 90 44, 170 44, 220 60" />
        <path d="M96 48 c -8 -11, -22 -9, -26 1 c 12 6, 22 2, 26 -1 Z" opacity="0.8" />
        <path d="M164 48 c 8 -11, 22 -9, 26 1 c -12 6, -22 2, -26 -1 Z" opacity="0.8" />

        {/* hanging strings + pans */}
        <path d="M52 58 L 40 108 M78 58 L 40 108" />
        <path d="M208 58 L 220 108 M182 58 L 220 108" />
        <path d="M14 108 C 24 132, 56 132, 66 108 Z" fill="var(--primary)" fillOpacity="0.08" />
        <path d="M194 108 C 204 132, 236 132, 246 108 Z" fill="var(--accent)" fillOpacity="0.1" />

        {/* base with a small root of leaves */}
        <path d="M108 190 C 120 178, 140 178, 152 190 C 140 196, 120 196, 108 190 Z" />
        <path d="M130 176 L 130 190" />
      </g>
    </svg>
  );
}
