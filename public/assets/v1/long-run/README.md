# "Build for the lonng run" social cards

`og-nyc.png` and `og-sf.png` are the backgrounds for the campaign's
Open Graph card (`/api/og?theme=long-run&city=<nyc|sf>`). 1200×630
each: the Inngest lockup baked in top-left, and one frame of that
city's hero illustration — the mouth, the tongue, and the runner
(New York's pizza slice, San Francisco's coffee cup) — flush to the
bottom edge. The title and the green city eyebrow are drawn over them
at request time, so the artwork carries no text.

Each frame is a real pose from that page's `RunningFriend.tsx`, not a
redraw: stride `d = 75` (full stride extension, no bob) at progress
`p = 0.5`, which puts the runner mid-card. Regenerate by rendering
that component's scene to SVG at those values and compositing it over
`#101010` at 108% width, cropped to 1200 and anchored to the bottom.

A `city` the route doesn't recognise falls back to the standard salmon
card rather than drawing the campaign layout over a missing
background, so adding a third city means adding its artwork here and
its key in `pages/api/og.tsx`.
