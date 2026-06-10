import { Engine } from '../core/Engine';
import type { LetterChar, Particle, FormationPoint } from '../core/types';
import { clamp01, easeInOutCubic, smoothstep } from '../core/utils';
import { scatterFormation } from '../formations/scatter';
import { rightExitFormation } from '../formations/rightExit';
import { typedCodeFormation } from '../formations/typedCode';

export type HeroCodeSceneOptions = {
  /** Multi-line monospace code. Lines starting with `■` are function titles. */
  code: string;
  /** Total particles. Letters fill the first N, outline dots fill the rest. */
  particleCount?: number;
  /** Timing knobs (ms). */
  scatterMs?: number;
  convergeMs?: number;
  /** Floor for any single cycle's duration (floor = 0.4 × this). */
  bulletCycleMs?: number;
  /**
   * When false, the cycle reel plays through every function ONCE then
   * freezes on the last one (step.invoke) instead of looping forever,
   * handing control to the user (click-to-jump). Default true keeps the
   * original loop-forever behavior.
   */
  loop?: boolean;
  /**
   * Fine-grained animation timings (ms). All optional — any omitted
   * key falls back to TIMING_DEFAULTS, so passing `{}` or nothing keeps
   * the original feel. `scatterMs` / `convergeMs` above own the intro
   * (dot drift + title formation); these own the per-step behavior.
   */
  timings?: Partial<HeroTimings>;
};

/** Per-step animation timings. See TIMING_DEFAULTS for the values. */
export type HeroTimings = {
  /** Per-char typewriter cadence — lower = faster typing. */
  typePerCharMs: number;
  /** Dot→letter settle window: how long each char's fly-in takes. */
  perCharSettleMs: number;
  /** Read-hold after a step finishes typing, before the next one. */
  postTypePauseMs: number;
  /** First-run accordion open speed (step.run sliding open). */
  titleSlideMs: number;
  /** Between-step wrap-collapse window. */
  collapseMs: number;
  /** Delay before the post-first-loop typewriter starts revealing. */
  typeStartMs: number;
};

const TIMING_DEFAULTS: HeroTimings = {
  typePerCharMs: 8,
  perCharSettleMs: 850,
  postTypePauseMs: 2200,
  titleSlideMs: 650,
  collapseMs: 120,
  typeStartMs: 80,
};

const DEFAULTS = {
  // 1000 particles is headroom for ~400 typed-code letters plus ~600
  // outline dots around them.
  particleCount: 1000,
  scatterMs: 2200,
  convergeMs: 2400,
  bulletCycleMs: 4200,
  loop: true,
} as const;

// Two-formation morph: `code` (the typed snippet) lerps to
// `rightExit` (off-canvas right) as the user scrolls. The next
// section's `InngestLogoCanvas` watermark picks up the dots flying in
// from the right and forms them into the Inngest logomark.
type Formations = { code: FormationPoint[]; rightExit: FormationPoint[] };

// Initial scatter density. Big enough that the dots themselves read
// as the opening element of the hero — they paint in before the
// titles fade in.
const HERO_SEED_DOTS = 720;

// Timing.
//
// The 6 per-step timings (type cadence, settle, read-hold pause,
// title-slide, collapse, type-start) live in TIMING_DEFAULTS above and
// are read per-instance via `this.t` so callers can override them. The
// behavioral notes that documented the old module-level consts:
//   · typeStartMs — breath between any layout transition and the body
//     typewriter starting; the typewriter never overlaps a layout shift.
//   · collapseMs — wrap-collapse window between cycles; with the layout
//     snapping this is just the breath before the new typewriter starts.
//   · postTypePauseMs — holds the formed snippet so it's readable.
//   · perCharSettleMs / typePerCharMs — first-loop per-char dot→letter
//     fly-in: each body char has its own settle window, staggered by the
//     type cadence, so dots fly in one-by-one left-to-right.
//   · titleSlideMs — first-run accordion open after titles converge into
//     the collapsed stack.
const CHAR_ACTIVE_RATIO = 5.0;
// CYCLE_CONVERGE_MS kept as a reference / minimum global beat for some
// math below.
const CYCLE_CONVERGE_MS = 1200;
// Letter only renders when the particle is within this many
// source-space pixels of its formation slot — keeps the dot
// reading as a DOT until it's nearly home, then snaps to the
// letter form. Anything further away stays a dot.
const LETTER_REVEAL_DIST_PX = 30;
// Duration of the per-char dot→letter morph after the wave reaches
// each particle's bodyLocalIdx. Short — the dot snaps into a
// letter rather than fading the letter in over time.
const LETTER_MORPH_MS  = 36;
// First-run rest before cycle 0 begins. Covers the title slide so the
// cycle's own typeStartMs buffer sits cleanly after the accordion
// is fully open.
// First-run rest used to wait for the title-slide to finish
// before kicking off the typewriter — but with the per-char dot
// settle, cycle 0 was visibly different from cycles 1/2 because
// it sat 650 ms at scatter while titles slid, then started
// flying. Dropping to 0 so cycle 0's dots start flying in
// PARALLEL with the title slide, matching cycles 1/2 exactly.
const FIRST_RUN_REST_MS = 0;
// Scroll-out letter→dot morph window (codeness). Raise LO for an earlier hand-off.
const LETTER_MORPH_HI = 0.99;
const LETTER_MORPH_LO = 0.93;
const EXTRA_DOTS_HI = 0.75;
const EXTRA_DOTS_LO = 0.20;

// Cursor field tuned to match the rest-of-site dot canvases
// (AICubeCanvas / FooterDotSphere): tight radius, very gentle
// per-frame push, more friction so particles settle quickly and
// the cursor barely ripples the field — just a hint of life, not
// a carved crater.
const JELLO_RADIUS = 90;
const JELLO_FORCE = 0.8;
const JELLO_DAMP = 0.78;

// Palette.
const SALMON_R = 217, SALMON_G = 140, SALMON_B = 135;
const BULLET_R = 244, BULLET_G = 99,  BULLET_B = 66;
// Inert code text settles to this off-white (#B3B3B3) rather than pure
// white, so the snippet reads a touch softer behind the headlines.
const TEXT_R = 179, TEXT_G = 179, TEXT_B = 179;
// Two-tone dot field: code-forming particles read in brand salmon;
// ambient floaters + trailing pool stay a quiet neutral grey.
const DOT_COLOR_SALMON = "rgb(251, 85, 54)";
const DOT_COLOR_GREY = "rgb(150, 150, 150)";


export class HeroCodeScene extends Engine {
  private readonly opts: Required<HeroCodeSceneOptions>;
  // Per-step timings, merged from TIMING_DEFAULTS + opts.timings in the
  // constructor. Read live in the update/render loops so a caller can
  // tune typing speed, settle, read-hold, etc. without code edits.
  private readonly t: HeroTimings;

  // Particles (one allocation, reused across rebuilds).
  private readonly maxParticles: number;
  private particleCount = 0;
  private letterCount = 0;
  private particles: Particle[] = [];
  private tx!: Float32Array;
  private ty!: Float32Array;
  private tz!: Float32Array;
  private particleAlpha!: Float32Array;
  private particleLetterMix!: Float32Array;

  // Scene data.
  private formations: Formations = {
    code: [],
    rightExit: [],
  };
  private introScatter: FormationPoint[] = [];
  private letterChars: LetterChar[] = [];
  private letterFontPx = 16;
  private typeIndexTotal = 1;
  private bulletIndices: number[] = [];

  // Cursor velocity tracking — scales the jello force by pointer
  // speed so a stationary cursor doesn't carve a static crater.
  private prevMouseX: number | null = null;
  private prevMouseY: number | null = null;
  private cursorSpeed = 0;

  // Cycle state (active step, collapse animation, bullet pulse).
  private cycleActiveFunc = 0;
  private cyclePrevFunc = -1;
  private cyclePrevAlpha = 0;
  private cycleBulletPulse = 0;
  // Manual override (click-to-jump): when non-null, drives a synthetic
  // cycle for the clicked function and freezes there, bypassing the
  // auto reel. Cleared by jumpTo(null).
  private manualActiveFunc: number | null = null;
  private manualCycleStartMs = -1;
  private cycleElapsedMs = 0;      // ms since the current cycle started
  private cycleStillRunning = false;
  private lastCycleActiveFunc = -1;
  private codenessShared = 1;
  private pendingResizeSnap = false;
  // Precomputed once in rebuildFormations: per-letter title ordinal
  // (0..titleCount-1 for title chars, mapped to owning title for body
  // chars). Avoids re-scanning letterChars per outline-dot per frame.
  private letterTitleOrdinal!: Int32Array;
  // Per-particle ordinal for title chars (and their outline dots),
  // walking left-to-right across ALL titles. Drives the per-char
  // dot settle during intro so titles form character-by-character
  // with the same mechanic as body chars during a cycle.
  private titleCharOrdinal!: Int32Array;
  private titleCount = 0;
  private titleCharTotal = 0;
  // Body-char counts per function — used to derive cycle durations.
  private bodyCountByFunc: number[] = [];
  // True while the very first cycle 0 is still active. Suppresses the
  // wrap-from-last-cycle collapse and enables the one-shot title slide.
  private firstRunActive = true;
  // Active post-intro clock that drives the cycle reel. Advances only
  // while the snippet is essentially fully formed (codeness ≈ 1); it
  // freezes the moment the user starts scrolling the code away, so
  // the active step doesn't drift while the particles are mid-morph
  // to rightExit. Resumes from the same value when codeness returns
  // to 1 — the active step picks up where it left off.
  private cycleClockMs = 0;
  // Engine-elapsed at the previous post-intro tick — used to compute
  // the per-frame dt fed into cycleClockMs.
  private lastTickElapsedMs = -1;
  // cycleClockMs value at which the looping reel begins (end of the
  // first-run cycle 0). -1 until that boundary is crossed.
  private loopAnchorMs = -1;
  // Per-cycle dot zoom-in runs ONLY during the very first pass
  // through every function. Once we've seen each func once and
  // wrap back to func 0 a second time, `firstLoopFinished` flips
  // true and the cycle reel falls back to plain advance-without-
  // converge — "once the code is there, it's there." Tracked via
  // `seenFuncsCount`: every unique func transition bumps it; when
  // it exceeds totalCycles we've started the second loop.
  private firstLoopFinished = false;
  private seenFuncsCount = 0;
  private lastTransitionedFunc = -1;
  // True once the intro reel has played through every step and settled
  // (loop=false: frozen on the last step; loop=true: first pass done).
  // Click-to-jump is gated on this so a mid-intro click can't force the
  // typewriter handoff while functions are still flying in.
  private introSettled = false;
  // Funcs whose cycle has finished playing — their body chars are
  // permanently removed from the field (no return to scatter), so
  // the field's dot count only DECREASES across the first loop.
  // Once all 3 cycles have run, this set has every func; from
  // there on the field density stays constant.
  private usedFuncs = new Set<number>();

  constructor(canvas: HTMLCanvasElement, options: HeroCodeSceneOptions) {
    super(canvas, { pauseOffscreen: true });
    // Play the whole code animation 40% faster.
    this.timeScale = 1.4;
    this.opts = { ...DEFAULTS, ...options } as Required<HeroCodeSceneOptions>;
    this.t = { ...TIMING_DEFAULTS, ...options.timings };

    this.maxParticles = this.opts.particleCount;
    this.tx = new Float32Array(this.maxParticles);
    this.ty = new Float32Array(this.maxParticles);
    this.tz = new Float32Array(this.maxParticles);
    this.particleAlpha = new Float32Array(this.maxParticles);
    this.particleLetterMix = new Float32Array(this.maxParticles);

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  /**
   * Override the default page-wide scroll progress with a hero-local
   * window. The canvas in this site is `absolute inset-0` to the hero,
   * so it scrolls *away* with the section — by the time you've scrolled
   * past one viewport you can no longer see the canvas. The base getter
   * normalises over the full page height, which means the code → inngest
   * → scatter morph would barely begin before the canvas is out of frame.
   *
   * Mapping 0 → 1 over ~130 % of one viewport height. Matches the
   * shared 1.3vh window used by every downstream InngestLogoCanvas
   * instance — dots are in transit for longer so the field of
   * particles reads as one continuous body the page wears as you
   * scroll.
   */
  protected get scrollProgress(): number {
    const range = Math.max(
      typeof window === 'undefined' ? 1 : window.innerHeight * 1.3,
      1,
    );
    return clamp01(this.scrollY / range);
  }

  private createParticle(): Particle {
    return {
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0,
      energy: 0,
      spring: 0.045 + Math.random() * 0.02,
      // Uniform ease across every particle so cycle transitions read
      // as a single coordinated morph instead of a per-letter liquid
      // wobble. Higher value (was 0.055-0.11 ranged) lands particles
      // on target faster and in unison.
      ease: 0.18,
      // Two-tier size distribution. The "close" (5–7.5 px) tier
      // was retired — its giant dots kept landing under the code
      // snippet and made the text hard to read. Mid + base only.
      size: (() => {
        const r = Math.random();
        if (r < 0.22) return 2.6 + Math.random() * 1.8;   // mid  (2.6–4.4)
        return 1.0 + Math.random() * 1.4;                  // base (1.0–2.4)
      })(),
      // Final value is assigned in `rebuildFormations` once each
      // particle's role (letter vs floater) is known.
      dotColor: "",
      char: '',
      typeIndex: -1,
      funcIndex: -1,
      isTitle: false,
      isCursor: false,
      bodyLocalIdx: -1,
      bulletCycleIdx: -1,
      // linkedLetterIdx is filled in rebuildFormations: own index
      // for letters, random pinned letter for outline dots.
      linkedLetterIdx: 0,
      jitterX: 0, jitterY: 0,
    };
  }

  protected build(): void {
    this.particleCount = this.opts.particleCount;
    this.introScatter = scatterFormation(this.particleCount, this.W, this.H);
    this.rebuildFormations();
    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particles[i];
      const s = this.introScatter[i];
      p.x = s.x; p.y = s.y; p.z = s.z ?? 0;
    }
    this.applyCanvasState();
  }

  protected onResized(): void {
    if (this.particleCount === 0) return;
    this.introScatter = scatterFormation(this.particleCount, this.W, this.H);
    this.rebuildFormations();
    // Fully clear so residual orange glow from the previous layout's
    // active bullet doesn't carry over. clearRect (vs solid-fill)
    // keeps the underlying section bg visible for one resize frame.
    this.ctx.clearRect(0, 0, this.W, this.H);
    this.pendingResizeSnap = true;
    // Canvas dim change resets context state — re-apply.
    this.applyCanvasState();
  }

  // Canvas state that's constant across frames. Set once after each
  // resize (canvas dim change resets the context); the render loop
  // never re-touches font/textAlign/textBaseline.
  private applyCanvasState(): void {
    const ctx = this.ctx;
    ctx.font = `500 ${this.letterFontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  // ──────────────────────────────────────────────────────────────────────
  //  Formations
  // ──────────────────────────────────────────────────────────────────────

  private rebuildFormations(): void {
    const code = typedCodeFormation({ code: this.opts.code, W: this.W, H: this.H });
    this.letterChars = code.chars.slice();
    this.letterCount = this.letterChars.length;
    this.letterFontPx = code.fontPx;
    this.typeIndexTotal = code.typeIndexTotal;

    // Letter particles sit on their glyph centers; outline particles
    // are pinned to a random letter's pixel offsets so the dot layer
    // traces the code shape. We pre-seed each target with yByState[0]
    // (first-cycle position) so the post-intro layout doesn't shove
    // particles around on the first frame.
    const codeTargets: FormationPoint[] = new Array(this.particleCount);
    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particles[i];
      if (i < this.letterCount) {
        const lc = this.letterChars[i];
        p.linkedLetterIdx = i;
        p.jitterX = 0;
        p.jitterY = 0;
        codeTargets[i] = { x: lc.x, y: lc.yByState[0] ?? lc.y, z: 0 };
      } else {
        const linkedIdx = Math.floor(Math.random() * this.letterCount);
        const linked = this.letterChars[linkedIdx];
        const off = linked.pixelOffsets.length > 0
          ? linked.pixelOffsets[Math.floor(Math.random() * linked.pixelOffsets.length)]
          : { dx: 0, dy: 0 };
        p.linkedLetterIdx = linkedIdx;
        p.jitterX = off.dx;
        p.jitterY = off.dy;
        const y0 = linked.yByState[0] ?? linked.y;
        codeTargets[i] = { x: linked.x + off.dx, y: y0 + off.dy, z: 0 };
      }
    }

    this.formations = {
      code: codeTargets,
      rightExit: rightExitFormation(this.particleCount, this.W, this.H),
    };

    // Walk letters once to derive: per-letter converge slot ordinal
    // (dense per-char index across title chars; funcIndex for body
    // chars), per-function body counts (used to size cycle durations),
    // total title-char count, and bullet indices. Avoids re-walking
    // letterChars per outline-dot per frame in updateZoomPhase.
    this.letterTitleOrdinal = new Int32Array(this.letterCount);
    this.titleCharOrdinal = new Int32Array(this.letterCount);
    this.bodyCountByFunc = [];
    this.bulletIndices = [];
    this.titleCount = 0;
    this.titleCharTotal = 0;
    for (let i = 0; i < this.letterCount; i++) {
      const lc = this.letterChars[i];
      if (lc.isTitle) {
        this.letterTitleOrdinal[i] = this.titleCount++;
        this.titleCharOrdinal[i] = this.titleCharTotal++;
      } else {
        this.letterTitleOrdinal[i] = Math.max(0, lc.funcIndex);
        this.titleCharOrdinal[i] = -1;
        if (lc.funcIndex >= 0) {
          this.bodyCountByFunc[lc.funcIndex] = (this.bodyCountByFunc[lc.funcIndex] ?? 0) + 1;
        }
      }
    }

    // Two-tone field: letter particles (the dots that swarm in to
    // become the code snippet / bullet markers) paint salmon; the
    // ambient floaters and trailing outline pool stay neutral grey so
    // they don't compete for attention.
    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particles[i];
      if (i < this.letterCount) {
        const lc = this.letterChars[i];
        p.char = lc.char;
        p.typeIndex = lc.typeIndex;
        p.funcIndex = lc.funcIndex;
        p.isTitle = lc.isTitle;
        p.bodyLocalIdx = lc.bodyLocalIdx;
        p.isCursor = lc.char === '|';
        if (lc.char === '■') {
          p.bulletCycleIdx = this.bulletIndices.length;
          this.bulletIndices.push(i);
        } else {
          p.bulletCycleIdx = -1;
        }
        p.dotColor = DOT_COLOR_SALMON;
        // Re-tier the size: letter particles get the MID tier
        // only (no base, no close) so the dots flying in to
        // form the code are visible-but-not-giant. Floaters
        // keep their two-tier distribution from createParticle().
        p.size = 2.6 + Math.random() * 1.8; // mid (2.6–4.4)
      } else {
        p.char = '';
        p.typeIndex = -1;
        p.funcIndex = -1;
        p.isTitle = false;
        p.bodyLocalIdx = -1;
        p.isCursor = false;
        p.bulletCycleIdx = -1;
        p.dotColor = DOT_COLOR_GREY;
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  //  Update
  // ──────────────────────────────────────────────────────────────────────

  protected update(_dtMs: number): void {
    const { scatterMs, convergeMs, bulletCycleMs } = this.opts;
    const introMs = scatterMs + convergeMs;
    const t = this.elapsedMs;

    if (t < scatterMs) {
      this.updateScatterPhase();
    } else if (t < introMs) {
      this.updateZoomPhase(t - scatterMs, convergeMs);
    } else {
      this.updatePostIntroPhase(t, bulletCycleMs);
    }

    // After resize, skip the ease-lerp and slam every particle to its fresh
    // target. Prevents the active bullet's glow from streaking across the
    // canvas while particles drift to new positions.
    if (this.pendingResizeSnap) {
      for (let i = 0; i < this.particleCount; i++) {
        const p = this.particles[i];
        p.x = this.tx[i];
        p.y = this.ty[i];
        p.z = this.tz[i];
        p.vx = 0;
        p.vy = 0;
      }
      this.pendingResizeSnap = false;
    }
  }

  private updateScatterPhase(): void {
    // ALL letter particles + the floaters are visible at scatter
    // so the field reads dense, and the dots that later zoom in to
    // form each function's code appear to come FROM the background
    // (not from invisible nowhere-positions). Only the trailing
    // outline-dot pool (>= HERO_SEED_DOTS, used for the scroll-out
    // exit halo) stays at alpha 0 until post-intro.
    const scatter = this.introScatter;
    for (let i = 0; i < this.particleCount; i++) {
      this.tx[i] = scatter[i].x;
      this.ty[i] = scatter[i].y;
      this.tz[i] = scatter[i].z ?? 0;
      const visible = i < this.letterCount || i < HERO_SEED_DOTS;
      this.particleAlpha[i] = visible ? 1 : 0;
      this.particleLetterMix[i] = 0;
    }
    this.codenessShared = 1;
  }

  private updateZoomPhase(convergeElapsed: number, convergeMs: number): void {
    // Only the function titles form during converge. Title particles
    // (and outline dots pinned to titles) fly to the collapsed stack
    // on a dense per-title-char schedule; body particles ride along on
    // their owning title's slot, invisibly, so they're at the right
    // (collapsed) spot when the typewriter starts revealing them.
    //
    // Indices in `[letterCount, HERO_SEED_DOTS)` are "floaters" — they
    // stay at their scatter position throughout, never converge to a
    // letter / outline slot, never exit on scroll. Always at alpha 1.
    const scatter = this.introScatter;

    for (let i = 0; i < this.particleCount; i++) {
      const isFloater = i >= this.letterCount && i < HERO_SEED_DOTS;
      if (isFloater) {
        // Pin floaters to their scatter base; their 3D rotation
        // (always-on, post-intro included) is applied per-particle
        // in the render loop.
        this.tx[i] = scatter[i].x;
        this.ty[i] = scatter[i].y;
        this.tz[i] = scatter[i].z ?? 0;
        this.particleAlpha[i] = 1;
        this.particleLetterMix[i] = 0;
        continue;
      }
      const p = this.particles[i];
      const isLetter = i < this.letterCount;
      const ref = this.letterChars[p.linkedLetterIdx];

      if (ref.isTitle) {
        // Title char / outline dot: per-char settle matching the
        // body-char vocabulary. Each title char (and its pinned
        // outline dot) flies from its scatter position to the
        // title slot via ease-in-out-sine, staggered by
        // `typePerCharMs` across the title-char ordinal.
        // Target must match code[i] (built in rebuildFormations:
        // letters → lc.x with no jitter; outline pool → linked.x +
        // jitterX) so there is NO position snap at the zoom→
        // post-intro handoff.
        const charIdx = this.titleCharOrdinal[p.linkedLetterIdx];
        const charStartMs = charIdx * this.t.typePerCharMs;
        const charT = clamp01(
          (convergeElapsed - charStartMs) / this.t.perCharSettleMs,
        );
        const charEased = -0.5 * (Math.cos(Math.PI * charT) - 1);
        const targetX = ref.x + (isLetter ? 0 : p.jitterX);
        // Converge titles into the COLLAPSED stack (all 3 titles tight
        // together), NOT the expanded step.run-open layout. The accordion
        // then opens in updateAccordionPositions, so the intro reads as
        // "titles stacked → step.run opens up and its code forms."
        const targetY = ref.yCollapsed + p.jitterY;
        const codeX = scatter[i].x + (targetX - scatter[i].x) * charEased;
        const codeY = scatter[i].y + (targetY - scatter[i].y) * charEased;
        this.tx[i] = codeX;
        this.ty[i] = codeY;
        this.tz[i] = (scatter[i].z ?? 0) * (1 - charEased);
        if (isLetter) {
          // Title LETTER particle: stays alpha=1, lm rises with
          // closeness to the formation slot.
          this.particleAlpha[i] = 1;
          const remX = targetX - codeX;
          const remY = targetY - codeY;
          const remDist = Math.sqrt(remX * remX + remY * remY);
          this.particleLetterMix[i] =
            clamp01(1 - remDist / LETTER_REVEAL_DIST_PX);
        } else {
          // Title OUTLINE dot (trailing pool, i >= HERO_SEED_DOTS):
          // visible at alpha=1 while flying in (so the title forms
          // as a dense dot cloud, not just bare letter glyphs),
          // then fades out smoothly in the LAST 450 ms of converge
          // so that by the zoom→post-intro handoff alpha is
          // already 0 — matching post-intro's extraDotAlpha=0 for
          // outline dots and avoiding the whole-hero pop.
          const fadeMs = 450;
          const fadeStart = convergeMs - fadeMs;
          this.particleAlpha[i] = convergeElapsed < fadeStart
            ? 1
            : 1 - clamp01((convergeElapsed - fadeStart) / fadeMs);
          this.particleLetterMix[i] = 0;
        }
        continue;
      }

      // Non-title branches below keep the old per-title slot timing
      // because they only affect body-outline dots that fade out
      // during converge (body letter particles override their own
      // position to scatter in the `isLetter` branch).
      const slot = this.letterTitleOrdinal[p.linkedLetterIdx];
      const perTypeSlot = convergeMs / Math.max(1, this.titleCount);
      const activeMs = Math.max(perTypeSlot * CHAR_ACTIVE_RATIO, 520);
      const localT = clamp01((convergeElapsed - slot * perTypeSlot) / activeMs);
      const t = easeInOutCubic(localT);
      const targetX = ref.x + p.jitterX;
      const targetY = ref.yCollapsed + p.jitterY;
      this.tx[i] = scatter[i].x + (targetX - scatter[i].x) * t;
      this.ty[i] = scatter[i].y + (targetY - scatter[i].y) * t;
      this.tz[i] = (scatter[i].z ?? 0) * (1 - t);

      if (isLetter) {
        // Body letter particle: STAY at its scatter position
        // (x/y/z) throughout converge, fully visible as a dot.
        // These are the background field dots that the per-cycle
        // settle will later fly into the function code formation.
        // The 3D depth stays so the field keeps its parallax /
        // rotation; the render now applies floater-style rotation
        // to body-letter dots so they don't go static at the
        // zoom→post-intro boundary.
        this.tx[i] = scatter[i].x;
        this.ty[i] = scatter[i].y;
        this.tz[i] = scatter[i].z ?? 0;
        this.particleAlpha[i] = 1;
        this.particleLetterMix[i] = 0;
      } else {
        // Body-outline dot (i >= letterCount but pinned to a body
        // char): fades out across converge so the trailing dot
        // pool doesn't snap-disappear at the post-intro handoff.
        this.particleAlpha[i] = i < HERO_SEED_DOTS
          ? 1 - clamp01(convergeElapsed / convergeMs)
          : 0;
        this.particleLetterMix[i] = 0;
      }
    }
    this.codenessShared = 1;
  }

  private updatePostIntroPhase(elapsed: number, cycleMs: number): void {
    // Two-formation morph: code → rightExit as the user scrolls.
    const t = easeInOutCubic(this.scrollProgress);
    const codeness = 1 - t;
    this.codenessShared = codeness;

    // Advance the cycle clock only while the snippet is essentially
    // fully formed. As soon as the user scrolls and particles start
    // morphing toward rightExit, the active step freezes — it'd be
    // jarring to see the accordion switch mid-decomposition.
    const dt = this.lastTickElapsedMs >= 0
      ? Math.max(0, elapsed - this.lastTickElapsedMs)
      : 0;
    this.lastTickElapsedMs = elapsed;
    if (codeness > 0.99) this.cycleClockMs += dt;

    this.updateCycleState(this.cycleClockMs, cycleMs);
    this.updateAccordionPositions(this.cycleClockMs);

    const code = this.formations.code;
    const exit = this.formations.rightExit;
    const letterVis = smoothstep(
      clamp01((codeness - LETTER_MORPH_LO) / (LETTER_MORPH_HI - LETTER_MORPH_LO)),
    );
    const extraDotAlpha = 1 - smoothstep(
      clamp01((codeness - EXTRA_DOTS_LO) / (EXTRA_DOTS_HI - EXTRA_DOTS_LO)),
    );

    const scatter = this.introScatter;
    for (let i = 0; i < this.particleCount; i++) {
      // Floaters: pinned to their scatter base while in view, then
      // lerp toward the rightExit formation as the user scrolls the
      // hero out — same exit choreography as the code particles, so
      // the entire field drifts off-screen right together. 3D
      // rotation continues to apply via the floater-specific
      // matrix in the render loop.
      const isFloater = i >= this.letterCount && i < HERO_SEED_DOTS;
      if (isFloater) {
        const s = scatter[i];
        const b = exit[i];
        const bz = b.z ?? 0;
        const sz = s.z ?? 0;
        this.tx[i] = s.x + (b.x - s.x) * t;
        this.ty[i] = s.y + (b.y - s.y) * t;
        this.tz[i] = sz + (bz - sz) * t;
        this.particleAlpha[i] = 1;
        this.particleLetterMix[i] = 0;
        continue;
      }
      const a = code[i], b = exit[i];
      this.tx[i] = a.x + (b.x - a.x) * t;
      this.ty[i] = a.y + (b.y - a.y) * t;
      const az = a.z ?? 0, bz = b.z ?? 0;
      this.tz[i] = az + (bz - az) * t;
      if (i < this.letterCount) {
        this.particleAlpha[i] = 1;
        this.particleLetterMix[i] = letterVis;
      } else {
        this.particleAlpha[i] = extraDotAlpha;
        this.particleLetterMix[i] = 0;
      }
    }

    // Per-cycle overrides for body chars. Two regimes:
    //
    //   FIRST LOOP (each func shown once): dot zoom-in from scatter
    //   to formation + post-settle salmon→white typewriter sweep.
    //   After dots come together (settle ends, chars are visible
    //   but salmon-tinged), a left-to-right wave drives each char's
    //   letterMix to 1, recolouring from salmon to white. Reads as
    //   "code running" once the snippet has formed.
    //
    //   AFTER FIRST LOOP: no converge, no typewriter — body chars
    //   for the active func sit at full visibility / white. The
    //   inactive funcs' body chars are hidden either way. Skipped
    //   during scroll-out so the existing exit lerp can run.
    if (codeness > 0.99 && this.cycleStillRunning) {
      const activeFunc = this.cycleActiveFunc;
      if (!this.firstLoopFinished) {
        // PER-CHAR settle: each body char has its own scatter→
        // formation flight, staggered by typePerCharMs so the
        // dots fly in left-to-right at typewriter pace. A char's
        // particle sits at its scatter position as a field dot
        // BEFORE its turn; during the window the dot eases into
        // its formation slot AND morphs from dot to letter; after,
        // it's a letter at formation. No "ghost orange text"
        // beyond the typewriter front — untyped chars are still
        // dots, not partially-rendered letters.
        for (let i = 0; i < this.letterCount; i++) {
          const p = this.particles[i];
          const lc = this.letterChars[p.linkedLetterIdx];
          if (lc.isTitle || lc.funcIndex < 0) continue;
          const s = scatter[i];
          const b = exit[i];
          const sz = s.z ?? 0;
          const bz = b.z ?? 0;
          if (lc.funcIndex !== activeFunc) {
            if (this.usedFuncs.has(lc.funcIndex)) {
              // Already had its cycle — those dots have been
              // "spent" forming letters; they don't return to
              // the field. Field density decreases each cycle.
              this.particleAlpha[i] = 0;
              this.particleLetterMix[i] = 0;
            } else {
              // Not yet used — sits in the field as a scatter
              // dot with a slow per-particle ambient drift so
              // the field reads as dust floating in air. Lower
              // frequencies + larger amplitude give a longer,
              // gentler arc; uncorrelated phases prevent the
              // swarm-of-insects synchrony.
              const phase = i * 0.137;
              const ambX = Math.sin(this.elapsedMs * 0.00018 + phase) * 5;
              const ambY = Math.cos(this.elapsedMs * 0.00014 + phase * 1.7) * 5;
              this.tx[i] = s.x + ambX + (b.x - s.x) * t;
              this.ty[i] = s.y + ambY + (b.y - s.y) * t;
              this.tz[i] = sz + (bz - sz) * t;
              this.particleAlpha[i] = 1;
              this.particleLetterMix[i] = 0;
            }
            continue;
          }
          // Active func body char — per-char timing.
          const charStartMs = p.bodyLocalIdx * this.t.typePerCharMs;
          const charT = clamp01(
            (this.cycleElapsedMs - charStartMs) / this.t.perCharSettleMs,
          );
          // Easing applied below; pre-settle, mid-settle, settled
          // are the three positional states for this particle.
          const elapsed = this.cycleElapsedMs - charStartMs;
          let codeX: number;
          let codeY: number;
          let codeZ: number;
          let lm: number;
          if (elapsed < 0) {
            // Pre-settle: dot at scatter, in the field.
            codeX = s.x;
            codeY = s.y;
            codeZ = sz;
            lm = 0;
          } else if (charT < 1) {
            // Mid-settle: fly to formation with ease-in-out-sine
            // (breath curve — slow takeoff + slow landing).
            const charEased = -0.5 * (Math.cos(Math.PI * charT) - 1);
            const targetX = code[i].x;
            const targetY = code[i].y;
            const targetZ = code[i].z ?? 0;
            codeX = s.x + (targetX - s.x) * charEased;
            codeY = s.y + (targetY - s.y) * charEased;
            codeZ = sz + (targetZ - sz) * charEased;
            // Letter reveal is gated by actual REMAINING DISTANCE
            // to the formation slot — particles stay dots until
            // they're within LETTER_REVEAL_DIST_PX (30 px), then
            // morph to letters as they close that last gap. No
            // letters materialising "in mid-air"; if the dot's
            // still flying, it's still a dot.
            const remX = targetX - codeX;
            const remY = targetY - codeY;
            const remDist = Math.sqrt(remX * remX + remY * remY);
            lm =
              clamp01(1 - remDist / LETTER_REVEAL_DIST_PX) * letterVis;
          } else {
            // Settled: letter at formation.
            codeX = code[i].x;
            codeY = code[i].y;
            codeZ = code[i].z ?? 0;
            lm = letterVis;
          }
          // Apply scroll-out exit lerp on top of the current
          // code position so all states still scroll off together.
          this.tx[i] = codeX + (b.x - codeX) * t;
          this.ty[i] = codeY + (b.y - codeY) * t;
          this.tz[i] = codeZ + (bz - codeZ) * t;
          this.particleAlpha[i] = 1;
          this.particleLetterMix[i] = lm;
        }
      } else {
        // Post-first-loop: all funcs have already been "used"
        // during the first pass, so their body chars stay hidden
        // — the field's dot count is fixed at the reduced
        // density it reached when the last cycle landed.
        // Active func keeps the main loop defaults (alpha 1, lm
        // letterVis) and runs the classic typewriter.
        for (let i = 0; i < this.letterCount; i++) {
          const p = this.particles[i];
          const lc = this.letterChars[p.linkedLetterIdx];
          if (lc.isTitle || lc.funcIndex < 0) continue;
          if (lc.funcIndex !== activeFunc) {
            this.particleAlpha[i] = 0;
            this.particleLetterMix[i] = 0;
          }
        }
      }
    }
  }

  private updateCycleState(cycleClockMs: number, cycleMs: number): void {
    this.cycleActiveFunc = 0;
    this.cyclePrevFunc = -1;
    this.cyclePrevAlpha = 0;
    this.cycleBulletPulse = 0;
    this.cycleStillRunning = false;

    const totalCycles = this.bulletIndices.length;
    if (totalCycles === 0) return;

    // Manual override (bullet click): drive a synthetic cycle for the
    // clicked function and freeze there. Bypasses the auto reel; the
    // active func still flies in / pulses via the normal active-func
    // render path.
    if (this.manualActiveFunc !== null) {
      if (this.manualCycleStartMs < 0) this.manualCycleStartMs = cycleClockMs;
      const elapsed = Math.max(0, cycleClockMs - this.manualCycleStartMs);
      this.cycleStillRunning = true;
      this.cycleActiveFunc = this.manualActiveFunc;
      this.cycleElapsedMs = elapsed;
      const n = this.bodyCountByFunc[this.manualActiveFunc] ?? 0;
      const synthDur = Math.max(
        cycleMs * 0.4,
        n * this.t.typePerCharMs + this.t.perCharSettleMs + this.t.postTypePauseMs,
      );
      const localPhase = Math.min(1, elapsed / synthDur);
      this.cycleBulletPulse = Math.abs(Math.sin(localPhase * Math.PI * 2));
      return;
    }

    // Per-cycle duration = layout-settle lead (collapse window for
    // loops, none for first-run cycle 0) + post-layout buffer + body
    // typewriter + cursor-blink pause. Floored at cycleMs × 0.4 so
    // very short bodies still get a readable beat.
    const cycleFloorMs = cycleMs * 0.4;
    const durationOf = (idx: number, isFirstRun: boolean): number => {
      const n = this.bodyCountByFunc[idx] ?? 0;
      const lead = isFirstRun ? 0 : this.t.collapseMs;
      // First-loop per-char settle wraps when the LAST char's
      // window ends: n × typePerCharMs staggered start +
      // perCharSettleMs for its own flight. Post-first-loop
      // typewriter completes faster but fits in the same window
      // (extra time becomes a read-hold pause).
      return Math.max(
        cycleFloorMs,
        lead + n * this.t.typePerCharMs + this.t.perCharSettleMs + this.t.postTypePauseMs,
      );
    };

    // First run: hold cycle 0 in isolation until FIRST_RUN_REST_MS has
    // elapsed (covers the title slide) plus the cycle's own duration.
    // The looping reel anchors at that boundary so its pace is
    // independent of the (longer) first-run rest.
    const firstCycleDur = durationOf(0, true);
    if (this.firstRunActive) {
      const firstCycleEnd = FIRST_RUN_REST_MS + firstCycleDur;
      if (cycleClockMs < firstCycleEnd) {
        this.cycleStillRunning = true;
        this.cycleActiveFunc = 0;
        this.cycleElapsedMs = Math.max(0, cycleClockMs - FIRST_RUN_REST_MS);
        const localPhase = this.cycleElapsedMs / firstCycleDur;
        this.cycleBulletPulse = Math.abs(Math.sin(localPhase * Math.PI * 2));
        // First cycle 0 uses the title slide for its opening transition,
        // so no wrap-collapse here.
        return;
      }
      this.firstRunActive = false;
      this.loopAnchorMs = firstCycleEnd;
      // Cycle 0 just finished its first-run pass — count it so the
      // loop's "first time through every func" gate can detect the
      // second-pass wrap correctly.
      this.seenFuncsCount = 1;
      this.lastTransitionedFunc = 0;
    }

    // Loop sequence starts at cycle 1 (cycle 0 just finished on the
    // first run), then wraps through 2, 0, 1, 2, ... When `loop` is
    // false the reel plays steps 1..last ONCE and freezes on the last
    // function (no wrap back to 0) so the user can drive it by click.
    const seqLen = this.opts.loop ? totalCycles : totalCycles - 1;
    if (seqLen <= 0) return;
    const seqDur: number[] = new Array(seqLen);
    let totalRun = 0;
    for (let step = 0; step < seqLen; step++) {
      const idx = (1 + step) % totalCycles;
      seqDur[step] = durationOf(idx, false);
      totalRun += seqDur[step];
    }
    if (totalRun <= 0) return;

    // loop=false clamps just inside the final slot instead of wrapping,
    // so the reel settles on the last function and stays there.
    const rawElapsed = Math.max(0, cycleClockMs - this.loopAnchorMs);
    const loopElapsed = this.opts.loop
      ? rawElapsed % totalRun
      : Math.min(rawElapsed, totalRun - 1);
    let cum = 0;
    let activeStep = 0;
    let activeIdx = 1 % totalCycles;
    for (let step = 0; step < seqLen; step++) {
      const idx = (1 + step) % totalCycles;
      if (loopElapsed < cum + seqDur[step]) { activeIdx = idx; activeStep = step; break; }
      cum += seqDur[step];
      activeIdx = idx; activeStep = step;
    }

    const currentDur = seqDur[activeStep];
    this.cycleStillRunning = true;
    this.cycleActiveFunc = activeIdx;
    this.cycleElapsedMs = loopElapsed - cum;
    const localPhase = this.cycleElapsedMs / currentDur;
    this.cycleBulletPulse = Math.abs(Math.sin(localPhase * Math.PI * 2));

    // Intro is settled once the reel reaches its final step: every
    // earlier function has flown in (and sits formed at `tx`), so a
    // click handoff is safe from here on. For loop=true this also trips
    // alongside `firstLoopFinished`; for loop=false (which never flips
    // that flag) it's the only "intro done" signal click-to-jump has.
    if (activeStep === seqLen - 1) this.introSettled = true;

    // Wrap-collapse: previous func's body fades out as the new cycle
    // starts. Previous index walks the loop order (1 → 2 → 0 → 1...).
    if (this.cycleElapsedMs < this.t.collapseMs) {
      this.cyclePrevFunc = (activeIdx - 1 + totalCycles) % totalCycles;
      // Previous body switches off instantly on cycle change — was
      // an `easeInOutCubic` fade-out over collapseMs, but with the
      // layout snapping (no lerp) the prev text chars sat at the new
      // y positions while fading, reading as a jumbled / layered
      // mess for ~750 ms. Snap to 0 immediately.
      this.cyclePrevAlpha = 0;
    }

    // Track unique func transitions for the "first loop only"
    // converge gate. Counts each NEW funcIndex the cycle reel lands
    // on; once we've passed every func once and start the second
    // pass, flip `firstLoopFinished` so subsequent cycles skip the
    // dot zoom-in.
    if (
      !this.firstLoopFinished &&
      activeIdx !== this.lastTransitionedFunc
    ) {
      // Mark the func we're LEAVING as "used" — its body chars
      // shouldn't return to the field; they've spent themselves
      // forming code. The field shrinks each cycle.
      if (this.lastTransitionedFunc >= 0) {
        this.usedFuncs.add(this.lastTransitionedFunc);
      }
      this.lastTransitionedFunc = activeIdx;
      this.seenFuncsCount += 1;
      if (this.seenFuncsCount > totalCycles) {
        this.firstLoopFinished = true;
      }
    }
  }

  private updateAccordionPositions(postIntroMs: number): void {
    // Between-cycle position lerp removed — titles + prev-body chars
    // SNAP to their new Y position the instant the active function
    // changes, so the layout doesn't read as a horizontal "drag" /
    // motion blur as letters slide between accordion slots. Only the
    // first-run title-slide animation still interpolates (covers the
    // one-off opening accordion move on initial load).
    const activeFunc = this.cycleActiveFunc;

    // First-run accordion OPEN. The titles converged into the collapsed
    // stack during the zoom phase; here we slide them (and step.run's
    // forming body) from that collapsed layout out to the expanded
    // (func-0-open) layout over titleSlideMs — so step.run "opens up"
    // and its code forms in the space that appears. Subsequent cycles
    // snap straight to the active layout (openT = 1).
    let openT = 1;
    if (this.firstRunActive) {
      openT = easeInOutCubic(clamp01(this.cycleElapsedMs / this.t.titleSlideMs));
    }
    const code = this.formations.code;
    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particles[i];
      const lc = this.letterChars[p.linkedLetterIdx];
      const expandedY = lc.yByState[activeFunc] + p.jitterY;
      if (openT >= 1) {
        code[i].y = expandedY;
      } else {
        const collapsedY = lc.yCollapsed + p.jitterY;
        code[i].y = collapsedY + (expandedY - collapsedY) * openT;
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  //  Render
  // ──────────────────────────────────────────────────────────────────────

  protected render(): void {
    const ctx = this.ctx;
    const t = this.elapsedMs;
    const introMs = this.opts.scatterMs + this.opts.convergeMs;

    // Trail decay via alpha-erase rather than a dark overlay, so the
    // hero's grain-bg image shows through the canvas instead of being
    // covered by a black wash. `destination-out` with a low-alpha fill
    // fades each previous-frame pixel toward transparent while leaving
    // the underlying section background untouched.
    // Trail decay opacity bumped 0.38 → 0.85 so previous-frame ghosts
    // fade out almost completely each frame. Eliminates the motion
    // blur / "drag" on the code as cycles transition; text now reads
    // crisp and sharp instead of smeared.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.globalCompositeOperation = 'source-over';

    // 3D turn during intro only — applies to ALL particles while
    // forming.
    const rotActive = t < introMs;
    let cosY = 1, sinY = 0, cosX = 1, sinX = 0;
    if (rotActive) {
      const phase2Progress = Math.min(1, Math.max(0, (t - this.opts.scatterMs) / this.opts.convergeMs));
      const rotAmpl = 1 - easeInOutCubic(phase2Progress);
      const rotPhase = t * 0.001;
      const rotY = Math.sin(rotPhase * 1.0) * 0.55 * rotAmpl;
      const rotX = Math.cos(rotPhase * 0.7) * 0.18 * rotAmpl;
      cosY = Math.cos(rotY); sinY = Math.sin(rotY);
      cosX = Math.cos(rotX); sinX = Math.sin(rotX);
    }
    // Floater-only rotation: ALWAYS on so the surviving scatter
    // particles keep drifting in 3D space even after the code has
    // formed. Slow phase + small amplitude = dust-in-air feel.
    const fRotPhase = t * 0.00035;
    const fRotY = Math.sin(fRotPhase * 1.0) * 0.32;
    const fRotX = Math.cos(fRotPhase * 0.7) * 0.10;
    const fCosY = Math.cos(fRotY), fSinY = Math.sin(fRotY);
    const fCosX = Math.cos(fRotX), fSinX = Math.sin(fRotX);
    const focal = Math.max(this.W, this.H) * 0.8;
    const cxW = this.W / 2, cyW = this.H / 2;

    // On cycle advance, snap the NEW cycle's body chars to their
    // starting positions for this cycle's transition:
    //   · First loop: snap to original scatter so the zoom-in flies
    //     them into place.
    //   · After first loop: snap straight to formation so the new
    //     code is just there (no animation), matching the user's
    //     "once the code is there, it's there" rule.
    if (this.cycleActiveFunc !== this.lastCycleActiveFunc) {
      const newActive = this.cycleActiveFunc;
      const oldActive = this.lastCycleActiveFunc;
      const scatterSrc = this.introScatter;
      const flyIn = !this.firstLoopFinished;
      for (let i = 0; i < this.particleCount; i++) {
        const p = this.particles[i];
        const lc = this.letterChars[p.linkedLetterIdx];
        if (lc.isTitle || lc.funcIndex < 0) continue;
        if (lc.funcIndex === newActive) {
          // New active func: snap to starting position for its
          // settle (scatter during first loop, straight to
          // formation post-first-loop).
          if (flyIn) {
            const s = scatterSrc[i];
            p.x = s.x; p.y = s.y; p.z = s.z ?? 0;
          } else {
            p.x = this.tx[i]; p.y = this.ty[i]; p.z = this.tz[i];
          }
          p.vx = 0; p.vy = 0;
        } else if (lc.funcIndex === oldActive && flyIn) {
          // Old active func: TELEPORT back to scatter on the same
          // frame so the user doesn't see the letters "expanding"
          // outward as the Engine eases them back. Single-frame
          // hand-off — letters at formation vanish, dots reappear
          // in the field, and the new func's fly-in steals focus.
          const s = scatterSrc[i];
          p.x = s.x; p.y = s.y; p.z = s.z ?? 0;
          p.vx = 0; p.vy = 0;
        }
      }
      this.lastCycleActiveFunc = this.cycleActiveFunc;
    }

    // Cursor-driven "jello" displacement disabled — particles stay
    // locked to their formed code positions on hover. The mouse-track
    // state is still computed but never applied to the force field.
    const jelloOn = false;
    const mx = this.mouseX, my = this.mouseY;
    const radius2 = JELLO_RADIUS * JELLO_RADIUS;

    // Update cursor speed (smoothed) so the jello force only kicks in
    // while the pointer is actively moving — when the cursor stops,
    // the force fades and particles spring back to the formed code.
    if (mx !== null && my !== null && this.prevMouseX !== null && this.prevMouseY !== null) {
      const vx = mx - this.prevMouseX;
      const vy = my - this.prevMouseY;
      const inst = Math.hypot(vx, vy);
      this.cursorSpeed = this.cursorSpeed * 0.78 + inst * 0.22;
    } else {
      this.cursorSpeed *= 0.78;
    }
    this.prevMouseX = mx;
    this.prevMouseY = my;
    const stirFactor = Math.min(1, this.cursorSpeed / 6);

    const activeFuncIdx = this.cycleActiveFunc;
    const bulletPulse = this.cycleBulletPulse;
    const cycleElapsedMs = this.cycleElapsedMs;
    // Hoisted: intro-phase color uses these same constants per particle.
    const introPerTypeSlot = this.opts.convergeMs / this.typeIndexTotal;
    const introActiveMs = Math.max(introPerTypeSlot * CHAR_ACTIVE_RATIO, 520);
    const introConvergeElapsed = t - this.opts.scatterMs;
    // Hoisted: steady-state color is constant per frame (depends only
    // on shared codeness — drops as the user scrolls the snippet out).
    const steadyColorT = clamp01((this.codenessShared - 0.9) / 0.1);
    // Viewport cull bounds (margin covers letter + dot sizes plus the
    // intro-phase 3D projection wobble).
    const cullMinX = -60, cullMaxX = this.W + 60;
    const cullMinY = -60, cullMaxY = this.H + 60;

    // Two-pass render so code letters always paint OVER the floaters
    // (and outline dots): pass 1 = i >= letterCount (dots/floaters),
    // pass 2 = i < letterCount (letters). Inside each pass we use
    // the original ordering. Z-order matters for the 3-D floater
    // projection — without the split, floaters with positive z were
    // landing on top of fully-formed code letters.
    const orderedIndices: number[] = new Array(this.particleCount);
    let writeIdx = 0;
    for (let i = this.letterCount; i < this.particleCount; i++) {
      orderedIndices[writeIdx++] = i;
    }
    for (let i = 0; i < this.letterCount; i++) {
      orderedIndices[writeIdx++] = i;
    }

    for (let pass = 0; pass < this.particleCount; pass++) {
      const i = orderedIndices[pass];
      const p = this.particles[i];

      // Mouse jello — force scales with stirFactor so a stationary
      // cursor produces no displacement (no static crater forms).
      if (jelloOn && mx !== null && my !== null && stirFactor > 0.01) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < radius2 && d2 > 0.25) {
          const dist = Math.sqrt(d2);
          const falloff = 1 - dist / JELLO_RADIUS;
          const force = falloff * falloff * JELLO_FORCE * stirFactor;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.energy = 1;
        }
      }
      if (p.energy > 0.02) {
        p.vx += (this.tx[i] - p.x) * p.spring;
        p.vy += (this.ty[i] - p.y) * p.spring;
        p.x += p.vx; p.y += p.vy;
        p.vx *= JELLO_DAMP; p.vy *= JELLO_DAMP;
        p.energy *= 0.95;
      } else {
        const dx = this.tx[i] - p.x;
        const dy = this.ty[i] - p.y;
        // Snap-to-target threshold widened to 0.5 — kills the
        // residual sub-pixel drift more aggressively so the formed
        // code reads as locked-in-place, no liquid wobble during
        // cycle transitions either.
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          p.x = this.tx[i];
          p.y = this.ty[i];
        } else {
          p.x += dx * p.ease;
          p.y += dy * p.ease;
        }
        p.vx = 0; p.vy = 0;
      }
      p.z += (this.tz[i] - p.z) * p.ease;

      const alpha = this.particleAlpha[i];
      if (alpha <= 0.01) continue;

      // Floaters keep the 3D rotation forever; everyone else only
      // rotates during the intro.
      // EXCEPTION: body-letter dots (i < letterCount, !isTitle) ALSO
      // keep floater-style rotation in post-intro WHILE they're in
      // the field (lm < ~1). As lm rises (the dot is morphing into
      // its formed letter), the rotation effect is blended toward
      // flat so the formed letter sits locked at p.x/p.y. Without
      // this, the field "stops breathing" the moment the title
      // settle finishes — the user reads it as a glitch.
      const isFloater = i >= this.letterCount && i < HERO_SEED_DOTS;
      const lmEarly = this.particleLetterMix[i];
      // Body-letter dots get floater-style rotation in BOTH zoom
      // phase AND post-intro while they're in field state (lm < 1).
      // Crossing the zoom→post-intro boundary with the same rotation
      // source is what keeps the field continuous — switching from
      // rotAmpl-faded (zoom) to full (post-intro) would itself pop.
      const isFieldBodyDot =
        !isFloater &&
        i < this.letterCount &&
        !p.isTitle &&
        lmEarly < 0.999;
      let sx: number, sy: number, scaleS = 1, depthAlpha = 1;
      if (rotActive || isFloater || isFieldBodyDot) {
        const useFloaterRot = isFloater || isFieldBodyDot;
        const useC = useFloaterRot ? fCosY : cosY;
        const useS = useFloaterRot ? fSinY : sinY;
        const useCX = useFloaterRot ? fCosX : cosX;
        const useSX = useFloaterRot ? fSinX : sinX;
        const px = p.x - cxW;
        const py = p.y - cyW;
        const pz = p.z;
        const x1 = px * useC + pz * useS;
        const z1 = -px * useS + pz * useC;
        const y1 = py * useCX - z1 * useSX;
        const z2 = py * useSX + z1 * useCX;
        const projScaleS = focal / (focal - z2);
        const projSx = cxW + x1 * projScaleS;
        const projSy = cyW + y1 * projScaleS;
        const projDepth = Math.min(1, 0.30 + 0.70 * projScaleS);
        if (isFieldBodyDot) {
          // Blend toward flat as the dot forms into its letter.
          const w = 1 - lmEarly;
          sx = p.x + (projSx - p.x) * w;
          sy = p.y + (projSy - p.y) * w;
          scaleS = 1 + (projScaleS - 1) * w;
          depthAlpha = 1 + (projDepth - 1) * w;
        } else {
          scaleS = projScaleS;
          sx = projSx;
          sy = projSy;
          depthAlpha = projDepth;
        }
      } else {
        sx = p.x; sy = p.y;
      }
      // Viewport cull — skip the fillText/fillRect cost for particles
      // that projected off-screen (common during scroll's rightExit).
      if (sx < cullMinX || sx > cullMaxX || sy < cullMinY || sy > cullMaxY) continue;

      const lm = this.particleLetterMix[i];
      const dm = 1 - lm;

      // Letter render.
      if (lm > 0.01 && p.char) {
        // bodyMult gates per-char visibility on the POST-FIRST-LOOP
        // typewriter (chars reveal left-to-right from invisible).
        // First-loop reveal is handled by the update override
        // (alpha + lm + scatter→formation lerp), and gets
        // bodyMult=1 here. `revealT` mirrors bodyMult so the
        // salmon→white colour sweep tracks the per-char reveal
        // regardless of which regime is active.
        let bodyMult = 1;
        let revealT = 1;
        if (
          !p.isTitle &&
          p.funcIndex >= 0 &&
          p.funcIndex === activeFuncIdx &&
          this.cycleStillRunning
        ) {
          if (this.firstLoopFinished) {
            // Post-first-loop: classic typewriter — chars appear
            // left-to-right from invisible, salmon→white as each
            // is revealed.
            const charStartMs =
              this.t.typeStartMs + p.bodyLocalIdx * this.t.typePerCharMs;
            const charEndMs = charStartMs + this.t.typePerCharMs * 2;
            if (cycleElapsedMs >= charEndMs) bodyMult = 1;
            else if (cycleElapsedMs < charStartMs) bodyMult = 0;
            else bodyMult =
              (cycleElapsedMs - charStartMs) / (this.t.typePerCharMs * 2);
            revealT = bodyMult;
          } else {
            // First loop: per-char timing matches the update
            // override above. Visibility comes from `lm` (rises
            // during the char's settle window). `revealT` drives
            // the salmon→white colour shift across the same
            // window so each char arrives as a salmon letter and
            // resolves to white as it lands.
            bodyMult = 1;
            const charStartMs = p.bodyLocalIdx * this.t.typePerCharMs;
            const charEndMs = charStartMs + this.t.perCharSettleMs;
            if (cycleElapsedMs >= charEndMs) revealT = 1;
            else if (cycleElapsedMs <= charStartMs) revealT = 0;
            else revealT =
              (cycleElapsedMs - charStartMs) / this.t.perCharSettleMs;
          }
        }
        if (p.isCursor) {
          const blinkOn = Math.floor(t / 500) % 2 === 0;
          bodyMult *= blinkOn ? 1 : 0;
        }

        if (bodyMult > 0.01) {
          ctx.globalAlpha = alpha * depthAlpha * lm * bodyMult;
          // Only the active step's bullet pulses orange. Inactive
          // bullets fall through to the normal letter path and render
          // as Carbon-50 (white) like the rest of the inert text.
          if (p.bulletCycleIdx === activeFuncIdx && lm > 0.5) {
            const pulse = bulletPulse;
            const scalePulse = 1 + 0.35 * pulse;
            const brightness = 0.70 + 0.30 * pulse;
            const r = Math.round(BULLET_R * brightness);
            const g = Math.round(BULLET_G * brightness);
            const b = Math.round(BULLET_B * brightness);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.save();
            ctx.shadowBlur = 14 * pulse + 4;
            ctx.shadowColor = 'rgba(244, 99, 66, 0.9)';
            ctx.translate(sx, sy);
            ctx.scale(scalePulse, scalePulse);
            ctx.fillText(p.char, 0, 0);
            ctx.restore();
          } else {
            let colorT: number;
            if (this.manualActiveFunc !== null) {
              // Manual (clicked) step: clean white typewriter — no
              // salmon→white per-char sweep.
              colorT = 1;
            } else if (t < introMs) {
              if (p.isTitle) {
                // Titles / bullets form white during the intro — no
                // per-typeIndex salmon flash on the 2nd/3rd step titles
                // before the reel reaches them.
                colorT = 1;
              } else {
                const localT = clamp01(
                  (introConvergeElapsed - p.typeIndex * introPerTypeSlot) / introActiveMs,
                );
                colorT = clamp01((localT - 0.8) / 0.2);
              }
            } else if (revealT < 1) {
              // Salmon → white as the per-char reveal completes
              // (first-loop post-settle sweep OR post-first-loop
              // typewriter; both feed `revealT` above).
              colorT = revealT;
            } else {
              colorT = steadyColorT;
            }
            // Step titles (step.run() etc.) settle to pure white; the
            // inert body code settles to a softer #B3B3B3 at 0.9 alpha.
            const wR = p.isTitle ? 255 : TEXT_R;
            const wG = p.isTitle ? 255 : TEXT_G;
            const wB = p.isTitle ? 255 : TEXT_B;
            // Fast path: settled colour (codeness=1) is by far the most
            // common case — skip the salmon interpolation.
            if (colorT >= 1) {
              ctx.fillStyle = p.isTitle ? '#fff' : '#B3B3B3';
            } else {
              const r = Math.round(SALMON_R + (wR - SALMON_R) * colorT);
              const g = Math.round(SALMON_G + (wG - SALMON_G) * colorT);
              const b = Math.round(SALMON_B + (wB - SALMON_B) * colorT);
              ctx.fillStyle = `rgb(${r},${g},${b})`;
            }
            // Body code rides 0.9 of the computed alpha; titles stay full.
            if (!p.isTitle) ctx.globalAlpha *= 0.9;
            ctx.fillText(p.char, sx, sy);
          }
        }
      }

      // Dot render — flat filled circle in the particle's colour.
      // Letter particles (i < letterCount) only render as dots
      // during the per-cycle settle (zoom-in to form code); shrink
      // them so the converging code reads as a fine mesh of small
      // dots, not a swarm of scatter-sized blobs. Outline / floater
      // dots keep their full tier sizes.
      if (dm > 0.01) {
        // Letter particles render at their NATURAL tier size. They
        // were re-tiered in `rebuildFormations` to mid + close
        // only (no base tier) so the inbound dots are visible
        // without an artificial size boost. Floaters keep their
        // full tier distribution.
        const drawRadius = (p.size * scaleS) / 2;
        ctx.globalAlpha = alpha * depthAlpha * dm;
        ctx.fillStyle = p.dotColor;
        ctx.beginPath();
        ctx.arc(sx, sy, drawRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /**
   * Snap the intro reel to its settled end-state without waiting for it
   * to play out — every function marked formed/spent, the dot fly-in
   * over, and the reel clock driven past its final step so `introSettled`
   * trips. Lets a click fast-forward the load animation.
   */
  private settleIntroNow(): void {
    if (this.introSettled) return;
    const totalCycles = this.bulletIndices.length;
    if (totalCycles === 0) return;
    // Past scatter + converge so the render switches to the post-intro,
    // formed positioning.
    this.elapsedMs = Math.max(
      this.elapsedMs,
      this.opts.scatterMs + this.opts.convergeMs + 1
    );
    // Every function has "spent" its dots into code — none re-fly-in.
    for (let i = 0; i < totalCycles; i++) this.usedFuncs.add(i);
    this.firstLoopFinished = true;
    this.firstRunActive = false;
    this.seenFuncsCount = totalCycles + 1;
    this.lastTransitionedFunc = totalCycles - 1;
    // Drive the reel clock past its run so updateCycleState clamps to the
    // final step (loop=false) and trips `introSettled` next frame.
    if (this.loopAnchorMs < 0) this.loopAnchorMs = 0;
    this.cycleClockMs += 1_000_000;
    this.lastCycleActiveFunc = -1;
    this.introSettled = true;
  }

  // ── Click-to-jump public surface ─────────────────────────────────
  /**
   * Jump the reel to a function index and freeze there (manual mode),
   * or pass `null` to release the override and resume the auto reel.
   */
  jumpTo(funcIdx: number | null): void {
    if (funcIdx === null) {
      this.manualActiveFunc = null;
      this.manualCycleStartMs = -1;
      return;
    }
    const total = this.bulletIndices.length;
    if (total === 0) return;
    // Clicking mid-intro fast-forwards: snap the reel to its settled
    // end-state (every function formed) so impatient users can click a
    // function name to skip the load animation and start driving it.
    if (!this.introSettled) this.settleIntroNow();
    const clamped = Math.max(0, Math.min(funcIdx, total - 1));
    this.manualActiveFunc = clamped;
    this.manualCycleStartMs = -1;
    // The intro is over once the user clicks: switch the reel into its
    // post-first-loop mode so the clicked step reveals via the
    // TYPEWRITER (code types in left-to-right) instead of the particle
    // fly-in. Particles only form the code ONCE — during the initial
    // animation. This flag gates the converge/fly-in in both
    // updatePostIntroPhase and the render handoff/reveal.
    this.firstLoopFinished = true;
    // Force the render-side cycle handoff next frame so the clicked
    // function re-reveals even if it was already the active one.
    this.lastCycleActiveFunc = -1;
  }

  /**
   * Per-function title-row bounds in CSS pixels relative to the canvas
   * top-left (whole row: bullet through last char). The React overlay
   * renders an invisible click-catcher per row. Title y is looked up by
   * the CURRENTLY active function (the accordion shifts every row), not
   * by the title's own funcIndex.
   */
  getTitleBounds(): { funcIdx: number; x: number; y: number; w: number; h: number }[] {
    if (this.letterCount === 0) return [];
    const activeFunc = this.cycleActiveFunc;
    const perFunc = new Map<number, { minX: number; maxX: number; y: number }>();
    for (let i = 0; i < this.letterCount; i++) {
      const lc = this.letterChars[i];
      if (!lc.isTitle || lc.funcIndex < 0) continue;
      const cy = lc.yByState[activeFunc] ?? lc.y;
      const entry = perFunc.get(lc.funcIndex);
      if (!entry) {
        perFunc.set(lc.funcIndex, { minX: lc.x, maxX: lc.x, y: cy });
      } else {
        if (lc.x < entry.minX) entry.minX = lc.x;
        if (lc.x > entry.maxX) entry.maxX = lc.x;
      }
    }
    const pad = this.letterFontPx;
    const sideEndPad = this.letterFontPx * 0.8;
    const out: { funcIdx: number; x: number; y: number; w: number; h: number }[] = [];
    perFunc.forEach((e, funcIdx) => {
      out.push({
        funcIdx,
        x: e.minX - pad * 0.4,
        y: e.y - pad,
        w: e.maxX - e.minX + sideEndPad + pad * 0.4,
        h: pad * 1.6,
      });
    });
    out.sort((a, b) => a.funcIdx - b.funcIdx);
    return out;
  }
}
