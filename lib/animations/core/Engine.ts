/**
 * Canvas animation harness.
 *
 *   • Handles HiDPI, resize, rAF loop, mouse tracking, scroll, pause-off-screen.
 *   • Subclasses implement build() / update(dtMs) / render().
 *   • `elapsedMs` accumulates only while the canvas is visible — scenes
 *     opting into `pauseOffscreen` keep their state frozen during off-
 *     screen scroll instead of silently advancing the wall clock.
 *   • destroy() is idempotent and cleans up listeners, rAF, and observers.
 */
export abstract class Engine {
  protected readonly canvas: HTMLCanvasElement;
  protected readonly ctx: CanvasRenderingContext2D;
  protected W = 0;
  protected H = 0;
  protected DPR = 1;

  protected mouseX: number | null = null;
  protected mouseY: number | null = null;
  protected scrollY = 0;
  protected scrollMax = 1;
  protected elapsedMs = 0;

  private raf = 0;
  private running = false;
  private built = false;
  private lastFrame = 0;

  private readonly ro: ResizeObserver;
  private readonly io: IntersectionObserver | null;
  private readonly onMouseMove: (e: MouseEvent) => void;
  private readonly onMouseOut: (e: MouseEvent) => void;
  private readonly onScroll: () => void;
  private visible = true;

  constructor(canvas: HTMLCanvasElement, opts: { pauseOffscreen?: boolean } = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.canvas = canvas;
    this.ctx = ctx;

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);

    this.onMouseMove = (e) => { this.mouseX = e.clientX; this.mouseY = e.clientY; };
    this.onMouseOut = (e) => { if (!e.relatedTarget) { this.mouseX = null; this.mouseY = null; } };
    this.onScroll = () => this.updateScroll();
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('mouseout', this.onMouseOut, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });

    if (opts.pauseOffscreen && typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver(
        (entries) => { this.visible = entries[0]?.isIntersecting ?? true; },
        { threshold: 0 },
      );
      this.io.observe(canvas);
    } else {
      this.io = null;
    }
  }

  protected abstract build(): void;
  protected abstract update(dtMs: number): void;
  protected abstract render(): void;
  protected onResized(): void {}

  start(): void {
    if (this.running) return;
    this.running = true;
    // resize() handles the first build() once the canvas reports a
    // non-zero size — important when the canvas mounts inside a
    // `display: none` container (e.g. hidden md:block), where the
    // initial getBoundingClientRect is 0×0 and an immediate build()
    // would crash on zero-sized offscreen canvases.
    this.resize();
    this.updateScroll();
    this.lastFrame = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      // dt + elapsedMs only advance while visible AND built, so
      // scrolling past an off-screen canvas (or one not yet sized)
      // freezes state instead of drifting forward in wall-clock time.
      if (this.visible && this.built) {
        const dt = now - this.lastFrame;
        this.elapsedMs += dt;
        this.update(dt);
        this.render();
      }
      this.lastFrame = now;
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io?.disconnect();
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseout', this.onMouseOut);
    window.removeEventListener('scroll', this.onScroll);
  }

  private resize(): void {
    this.DPR = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.W = rect.width;
    this.H = rect.height;
    this.canvas.width = Math.max(1, Math.floor(this.W * this.DPR));
    this.canvas.height = Math.max(1, Math.floor(this.H * this.DPR));
    this.ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0);
    // Defer build() until we actually have layout. Scenes that sample
    // an offscreen canvas (typedCodeFormation) crash on 0×0 sources.
    if (this.W === 0 || this.H === 0) return;
    if (!this.built) {
      this.build();
      this.built = true;
    } else {
      this.onResized();
    }
  }

  private updateScroll(): void {
    const doc = document.documentElement;
    this.scrollY = window.scrollY;
    this.scrollMax = Math.max(1, doc.scrollHeight - window.innerHeight);
  }

  protected get scrollProgress(): number {
    return Math.min(1, Math.max(0, this.scrollY / this.scrollMax));
  }
}
