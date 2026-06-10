import type { LetterChar, TypedCodeFormation } from '../core/types';

type LineInfo = { isTitle: boolean; funcIndex: number };

type Config = {
  code: string;
  W: number;
  H: number;
};

/**
 * Lays out a monospace code snippet with `■` bullets as function headers.
 * Returns one LetterChar per non-whitespace glyph, each carrying:
 *   - x / y positions
 *   - yByState[]  — y-coord per active-function state (for accordion)
 *   - pixelOffsets[] — opaque-pixel offsets within the glyph (for outline dots)
 */
export function typedCodeFormation({ code, W, H }: Config): TypedCodeFormation {
  const off = document.createElement('canvas');
  const octx = off.getContext('2d')!;
  off.width = W; off.height = H;

  const lines = code.split('\n');
  // Responsive layout: keep the snippet clear of the hero headlines. On
  // mobile we center the block horizontally and compress vertically so it
  // sits between the two headlines instead of fighting them.
  const mobile      = W < 640;
  const tinyScreen  = W < 780;
  const smallScreen = W < 1100;
  // The big 18px treatment only kicks in at `wide` (>= 1400). Between
  // 1100 and 1400 the headlines (fluid 11.11vw) are wide enough that a
  // large, left-shifted code block would collide with "INVISIBLE /
  // INFRA." — so keep the code smaller + further right there.
  const wide        = W >= 1400;
  const maxBlockW = mobile ? W * 0.92 : tinyScreen ? W * 0.38 : smallScreen ? W * 0.32 : wide ? W * 0.44 : W * 0.32;
  const maxBlockH = mobile ? H * 0.34 : tinyScreen ? H * 0.52 : smallScreen ? H * 0.58 : wide ? H * 0.78 : H * 0.68;
  // centerX shifted further right at lg+ so the code formation
  // doesn't crowd the "Invisible / Infra." title on the left. Mobile
  // stays centered; tinyScreen kept right-biased.
  const centerX   = mobile ? W * 0.50 : tinyScreen ? W * 0.80 : smallScreen ? W * 0.80 : wide ? W * 0.75 : W * 0.80;
  // Font shrinks on medium / small viewports so the formation reads
  // smaller relative to the headlines (which themselves are being
  // scaled down by the fluid clamp in Hero.tsx). Mobile is hidden, so
  // the 11 px value is just a fallback.
  let fontPx = mobile ? 11 : tinyScreen ? 11 : smallScreen ? 12 : wide ? 18 : 14;
  const setFont = () => {
    octx.font = `500 ${fontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  };
  setFont();

  const longest = lines.reduce((a, l) => (l.length > a.length ? l : a), '');
  const lh = () => fontPx * 1.5;

  const lineInfo: LineInfo[] = [];
  {
    let c = -1;
    for (const line of lines) {
      const isTitle = line.indexOf('■') !== -1;
      if (isTitle) c++;
      lineInfo.push({ isTitle, funcIndex: Math.max(0, c) });
    }
  }
  const totalFuncs = lineInfo.reduce((m, i) => Math.max(m, i.funcIndex + 1), 0);

  // Size font against the most-expanded layout (function 0 open).
  while (
    (octx.measureText(longest).width > maxBlockW ||
      lh() * lines.filter((_, li) => lineInfo[li].isTitle || lineInfo[li].funcIndex === 0).length > maxBlockH) &&
    fontPx > 8
  ) {
    fontPx -= 1;
    setFont();
  }

  // Per-active-state y positions.
  // Also compute a "collapsed" layout where NO function is open — only
  // titles are visible, stacked tight. Body chars in collapsed state
  // ride on their title's y so converging particles land inside the
  // title before the accordion opens.
  const lineYsByActive: Array<Array<number | null>> = [];
  const titleYsByFunc: Array<Record<number, number>> = [];
  const lineYsCollapsed: Array<number | null> = [];
  const titleYsCollapsed: Record<number, number> = {};
  {
    let curY = 0;
    for (let li = 0; li < lines.length; li++) {
      const info = lineInfo[li];
      if (info.isTitle) {
        lineYsCollapsed.push(curY);
        titleYsCollapsed[info.funcIndex] = curY;
        curY += lh();
      } else {
        lineYsCollapsed.push(null);
      }
    }
  }
  for (let activeF = 0; activeF < totalFuncs; activeF++) {
    const lineYs: Array<number | null> = [];
    const titleYs: Record<number, number> = {};
    let curY = 0;
    for (let li = 0; li < lines.length; li++) {
      const info = lineInfo[li];
      const visible = info.isTitle || info.funcIndex === activeF;
      if (visible) {
        lineYs.push(curY);
        if (info.isTitle) titleYs[info.funcIndex] = curY;
        curY += lh();
      } else {
        lineYs.push(null);
      }
    }
    lineYsByActive.push(lineYs);
    titleYsByFunc.push(titleYs);
  }

  const blockW = octx.measureText(longest).width;
  const startX = centerX - blockW / 2;
  // Vertical centre is shifted down to ~58 % of viewport height (was
  // 50 %) so the top of the code block clears the "Unbreakable
  // Agents" headline at 17.8 vh + its own line height. Horizontal
  // separation with the bottom subline ("Turning AI into Agents." on
  // the left) means the bottom of the block can sit lower without
  // visual conflict. A minimum top-Y floor at 30 % of H guarantees
  // clearance even on tall narrow viewports where the block height
  // itself is small.
  // 0.40 puts the top of the code block at ~40 vh — same horizontal
  // line as the top of the "INVISIBLE / INFRA." display title on the
  // hero's left column (which is `lg:top-1/2 lg:-translate-y-1/2`
  // = 50 vh centre minus ~half its 2-line height).
  const MIN_TOP_VH = 0.40;
  const CENTRE_VH  = 0.58;
  // Anchor the top of the code block to a constant Y across every
  // active-function state. Title 0 (step.run) sits at this same y in
  // every cycle — only the body + titles below shift to make room as
  // the active function changes. Previously the block was vertically
  // centred per cycle, which made title 0 drift up/down as the
  // overall block height changed between functions.
  const startYsByActive = lineYsByActive.map(() => H * MIN_TOP_VH + lh() / 2);
  const startYCollapsed = (() => {
    let maxY = 0;
    for (const y of lineYsCollapsed) if (y !== null && y > maxY) maxY = y;
    const blockH = maxY + lh();
    const centred = H * CENTRE_VH - blockH / 2;
    const minTop  = H * MIN_TOP_VH;
    return Math.max(centred, minTop) + lh() / 2;
  })();

  // Flatten chars with per-state y.
  const chars: LetterChar[] = [];
  let typeIndex = 0;
  const bodyCounters: Record<number, number> = {};
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const info = lineInfo[li];
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci];
      if (ch !== ' ' && ch !== '\t') {
        const prefixW = octx.measureText(line.substring(0, ci)).width;
        const charW = octx.measureText(ch).width;
        const x = startX + prefixW + charW / 2;
        const yByState: number[] = [];
        for (let activeF = 0; activeF < totalFuncs; activeF++) {
          const lineY = lineYsByActive[activeF][li];
          const base = startYsByActive[activeF];
          const y = lineY !== null ? base + lineY : base + titleYsByFunc[activeF][info.funcIndex];
          yByState.push(y);
        }
        let bodyLocalIdx = -1;
        if (!info.isTitle) {
          if (bodyCounters[info.funcIndex] == null) bodyCounters[info.funcIndex] = 0;
          bodyLocalIdx = bodyCounters[info.funcIndex]++;
        }
        // Collapsed: titles sit on their stacked-tight y; body chars
        // ride on their owning title's collapsed y so converging
        // particles land inside the title and unfurl out of it.
        const collapsedLineY = info.isTitle
          ? lineYsCollapsed[li] as number
          : titleYsCollapsed[info.funcIndex];
        const yCollapsed = startYCollapsed + collapsedLineY;
        chars.push({
          char: ch,
          x,
          y: yByState[0],
          yByState,
          yCollapsed,
          typeIndex,
          funcIndex: info.funcIndex,
          isTitle: info.isTitle,
          bodyLocalIdx,
          pixelOffsets: [],
        });
      }
      typeIndex++;
    }
    typeIndex++;
  }

  // Sample per-glyph pixel offsets (so outline dots trace actual character shapes).
  octx.clearRect(0, 0, W, H);
  octx.fillStyle = '#fff';
  setFont();
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  for (const c of chars) octx.fillText(c.char, c.x, c.y);
  const imgData = octx.getImageData(0, 0, W, H).data;
  const halfH = fontPx * 0.72;
  for (const c of chars) {
    const charW = octx.measureText(c.char).width;
    const minX = Math.max(0, Math.floor(c.x - charW / 2 - 1));
    const maxX = Math.min(W - 1, Math.ceil(c.x + charW / 2 + 1));
    const minY = Math.max(0, Math.floor(c.y - halfH));
    const maxY = Math.min(H - 1, Math.ceil(c.y + halfH));
    const offsets: { dx: number; dy: number }[] = [];
    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const idx = (py * W + px) * 4;
        if (imgData[idx + 3] > 128) offsets.push({ dx: px - c.x, dy: py - c.y });
      }
    }
    (c as LetterChar & { pixelOffsets: { dx: number; dy: number }[] }).pixelOffsets = offsets;
  }

  return { chars, fontPx, typeIndexTotal: typeIndex };
}
