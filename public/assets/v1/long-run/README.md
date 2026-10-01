# "Build for the lonng run" social cards

`og-nyc.png` is the background for the campaign's Open Graph card
(`/api/og?theme=long-run`). 1200×630: the Inngest lockup baked in
top-left, and one frame of the New York hero illustration — the mouth,
the tongue, and the running pizza — flush to the bottom edge. The
title and the green city eyebrow are drawn over it at request time, so
the artwork carries no text.

The frame is a real pose from `components/v1/sections/NycLongRun/
RunningFriend.tsx`, not a redraw: stride `d = 75` (legs planted, no
bob) at progress `p = 0.5`, which puts the slice mid-card. Regenerate
by rendering that scene to SVG at those values and compositing it over
`#101010` at 108% width, cropped to 1200 and anchored to the bottom.

San Francisco still uses the default salmon card; it would need an
`og-sf.png` built the same way from the coffee-cup art.
