# ListenInn artwork

Drop the hand-drawn illustration files here to feature them on the site. The
code already renders on-brand SVG line-art in the meantime (see
`src/components/artwork.tsx`), so the layout will look complete until you add
these — then we swap the SVGs for your real images.

Expected filenames (so the swap is a one-line change per spot):

| File                        | Where it will show                          | Source (from your message) |
|-----------------------------|---------------------------------------------|----------------------------|
| `balance-in-bloom.png`      | Values page — "balance / fairness" motif    | The vine-wrapped scales    |
| `reading-circle.png`        | Home "Community care" band / About page     | The watercolour reading circle |
| `community-care.png`        | Home "Community care" band                  | "Community care for all who need it" banner |

Notes:
- PNG or JPG both fine; keep them reasonably sized (< ~500 KB each) for load speed.
- Once added, tell me and I'll replace the corresponding `<...Art />` SVG
  component with an `<img>` in the pages listed above.
