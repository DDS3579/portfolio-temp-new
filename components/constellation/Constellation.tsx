"use client";

import { useEffect, useRef } from "react";
import { ConstellationEngine } from "./engine";
import { lightState } from "@/lib/light-state";
import type { StateKey } from "@/content/constellation";

const SECTION_STATE: { id: string; pick: (p: number) => StateKey }[] = [
  { id: "chapters", pick: (p) => (p < .25 ? "origin" : p < .5 ? "build" : p < .75 ? "scale" : "conglomerate") },
];

const SECTION_DIRECT: { id: string; state: StateKey }[] = [
  { id: "work", state: "work" },
  { id: "journey", state: "journey" },
  { id: "contact", state: "contact" },
];

export function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFine = window.matchMedia("(pointer: fine)").matches;

    let engine: ConstellationEngine | null = null;
    try {
      engine = new ConstellationEngine(canvas);
    } catch {
      return;
    }
    engine.setReducedMotion(reduce);

    engine.onLightMove = (x, y) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      lightState.x = x / w;
      lightState.y = y / h;

      document.documentElement.style.setProperty("--lx", ((x / w) * 100) + "%");
      document.documentElement.style.setProperty("--ly", ((y / h) * 100) + "%");

      const list = document.querySelectorAll<HTMLElement>(".lit");
      for (let i = 0; i < list.length; i++) {
        const el = list[i]!;
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > h + 80) continue;
        el.style.setProperty("--lx-el", (x - r.left) + "px");
        el.style.setProperty("--ly-el", (y - r.top) + "px");
      }
    };

    // ── root override + pointer drift (H3) ──
    const period: HTMLElement | null =
      !reduce && isFine ? document.getElementById("hero-period") : null;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight * 0.55;
    let overrideWasActive = false;

    const updateOverride = () => {
      if (!period) return;
      const w = window as unknown as {
        __constellationRootOverride?: { x: number; y: number } | null;
      };

      if (window.scrollY > window.innerHeight * 0.35) {
        if (overrideWasActive) {
          // H6: snapshot the period's exact center as the trail's origin
          const r = period.getBoundingClientRect();
          engine!.startTrail({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          overrideWasActive = false;
        }
        w.__constellationRootOverride = null;
        return;
      }

      const r = period.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const dx = Math.max(-80, Math.min(80, (pointerX - window.innerWidth / 2) * 0.08));
      const dy = Math.max(-80, Math.min(80, (pointerY - window.innerHeight * 0.55) * 0.08));

      w.__constellationRootOverride = { x: cx + dx, y: cy + dy };
      overrideWasActive = true;
    };

    if (period) {
      const ro = new ResizeObserver(updateOverride);
      ro.observe(period);
      document.fonts?.ready.then(updateOverride);
      setTimeout(updateOverride, 100);
      setTimeout(updateOverride, 300);
      updateOverride();
      window.addEventListener("resize", updateOverride);
      window.addEventListener(
        "pointermove",
        (e: PointerEvent) => {
          pointerX = e.clientX;
          pointerY = e.clientY;
          updateOverride();
        },
        { passive: true }
      );
    }

    // ── state selection ──
    let queued = false;
    const computeState = () => {
      const vh = window.innerHeight;
      const center = window.scrollY + vh * 0.5;

      const chaptersEl = document.getElementById("chapters");
      if (chaptersEl) {
        const r = chaptersEl.getBoundingClientRect();
        const top = window.scrollY + r.top;
        const total = chaptersEl.offsetHeight - vh;
        if (total > 0 && center >= top && center <= top + total + vh * 0.5) {
          const p = Math.min(1, Math.max(0, (center - top) / total));
          const pick = SECTION_STATE[0]!.pick(p);
          engine!.setState(pick);
          return;
        }
      }

      for (const s of SECTION_DIRECT) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.55 && r.bottom > vh * 0.35) {
          engine!.setState(s.state);
          return;
        }
      }

      if (window.scrollY < vh * 0.5) engine!.setState("hero");
      else engine!.setState("conglomerate");
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        computeState();
        if (period) updateOverride();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      engine!.resize();
      onScroll();
    });
    computeState();

    engine.start();
    const onVis = () => {
      if (document.hidden) engine!.stop();
      else engine!.start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      engine!.destroy();
    };
  }, []);

  return <canvas id="constellation" ref={ref} aria-hidden="true" />;
}
