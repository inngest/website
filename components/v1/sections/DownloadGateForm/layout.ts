// Shared column-width definitions for the benchmark-report page.

// Editorial sections sit in a centered 800px column within the 1440
// frame. px-6 keeps a gutter on mobile; from lg up the column hits its
// exact 800px width.
export const SECTION = "relative mx-auto w-full max-w-[800px] px-6 lg:px-0";

// The hero alone spans the wider 1440 frame (matching Home/AI); the
// editorial sections below stay at 1280.
export const HERO_SECTION =
  "relative mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-8";
