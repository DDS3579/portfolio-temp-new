import { EDGES, NODE_IDS, STATES, type StateKey } from "@/content/constellation";

type Live = { x: number; y: number; o: number };

export class ConstellationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private DPR = 1;
  private live: Live[] = NODE_IDS.map(() => ({ x: 0, y: 0, o: 0 }));
  private target: StateKey = "hero";
  private rafId = 0;
  private lastT = 0;
  private running = false;
  private reducedMotion = false;

  light = { x: 0, y: 0 };
  onLightMove?: (x: number, y: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas 2D not available");
    this.ctx = ctx;
    this.resize();
    const st = STATES.hero;
    for (let i = 0; i < this.live.length; i++) {
      this.live[i]!.x = st[i]!.x * this.W;
      this.live[i]!.y = st[i]!.y * this.H;
      this.live[i]!.o = st[i]!.o;
    }
    this.light.x = this.live[0]!.x;
    this.light.y = this.live[0]!.y;
  }

  setReducedMotion(v: boolean) {
    this.reducedMotion = v;
  }

  resize() {
    this.DPR = Math.min(window.devicePixelRatio || 1, 2);
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width = Math.floor(this.W * this.DPR);
    this.canvas.height = Math.floor(this.H * this.DPR);
    this.canvas.style.width = this.W + "px";
    this.canvas.style.height = this.H + "px";
    this.ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0);
  }

  setState(s: StateKey) {
    if (this.target !== s) this.target = s;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastT = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  destroy() {
    this.stop();
  }

  private tick = (t: number) => {
    const dt = Math.min(50, t - this.lastT) / 16.6667;
    this.lastT = t;
    this.draw(dt, t);
    this.rafId = requestAnimationFrame(this.tick);
  };

  private draw(dt: number, t: number) {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);

    const st = STATES[this.target];
    const kEff = this.reducedMotion ? 1 : 0.055 * dt;

    const rootOverride = (window as unknown as {
      __constellationRootOverride?: { x: number; y: number } | null;
    }).__constellationRootOverride;

    for (let i = 0; i < this.live.length; i++) {
      const l = this.live[i]!;
      const tg = st[i]!;
      let tx = tg.x * W;
      let ty = tg.y * H;
      if (i === 0 && rootOverride) {
        tx = rootOverride.x;
        ty = rootOverride.y;
      }
      l.x += (tx - l.x) * kEff;
      l.y += (ty - l.y) * kEff;
      l.o += (tg.o - l.o) * kEff;
    }

    const root = this.live[0]!;
    const lightK = this.reducedMotion ? 1 : 0.08 * dt;
    this.light.x += (root.x - this.light.x) * lightK;
    this.light.y += (root.y - this.light.y) * lightK;
    this.onLightMove?.(this.light.x, this.light.y);

    const edges = EDGES[this.target];
    const edgeBase = this.target === "contact" ? 0 : 1;
    ctx.lineWidth = 1;
    for (const [a, b] of edges) {
      const na = this.live[a]!;
      const nb = this.live[b]!;
      if (na.o < 0.05 || nb.o < 0.05) continue;
      const o = Math.min(na.o, nb.o) * edgeBase;
      const mx = (na.x + nb.x) / 2;
      const my = (na.y + nb.y) / 2;
      const d = Math.hypot(mx - this.light.x, my - this.light.y);
      const warm = Math.max(0, 1 - d / (Math.min(W, H) * 0.75));
      const r = Math.round(255 * (1 - warm) + 232 * warm);
      const g = Math.round(255 * (1 - warm) + 176 * warm);
      const bl = Math.round(255 * (1 - warm) + 75 * warm);
      const alpha = (0.10 + warm * 0.28) * o;
      ctx.strokeStyle = "rgba(" + r + "," + g + "," + bl + "," + alpha + ")";
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.stroke();
    }

    for (let i = 0; i < this.live.length; i++) {
      const n = this.live[i]!;
      if (n.o < 0.02) continue;
      const bloomR = 34 + n.o * 22;
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, bloomR);
      grd.addColorStop(0, "rgba(255,217,160," + (0.30 * n.o) + ")");
      grd.addColorStop(0.35, "rgba(232,176,75," + (0.11 * n.o) + ")");
      grd.addColorStop(1, "rgba(232,176,75,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x, n.y, bloomR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,217,160," + n.o + ")";
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.target === "contact" && !this.reducedMotion) {
      const pulse = Math.sin(t / 900) * 0.5 + 0.5;
      const n = this.live[0]!;
      const R = 40 + pulse * 30;
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, R);
      grd.addColorStop(0, "rgba(255,217,160," + (0.10 * (1 - pulse)) + ")");
      grd.addColorStop(1, "rgba(255,217,160,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
