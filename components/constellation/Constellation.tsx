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

      // shared state for the WebGL fog (zero DOM reads in its hot path)
      lightState.x = x / w;
      lightState.y = y / h;

      // CSS vars for .bg-fog and general use
      document.documentElement.style.setProperty("--lx", ((x / w) * 100) + "%");
      document.documentElement.style.setProperty("--ly", ((y / h) * 100) + "%");

      // per-element lit surfaces
      const list = document.querySelectorAll<HTMLElement>(".lit");
      for (let i = 0; i < list.length; i++) {
        const el = list[i]!;
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > h + 80) continue;
        el.style.setProperty("--lx-el", (x - r.left) + "px");
        el.style.setProperty("--ly-el", (y - r.top) + "px");
      }
    };

    // hero period anchor → root node sits on the period
    if (!reduce && isFine) {
      const period = document.getElementById("hero-period");
      const setOverride = () => {
        if (!period) return;
        const r = period.getBoundingClientRect();
        (window as unknown as { __constellationRootOverride?: { x: number; y: number } | null })
          .__constellationRootOverride = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      };
      setOverride();
      const ro = new ResizeObserver(setOverride);
      if (period) ro.observe(period);
      window.addEventListener("resize", setOverride);
      document.fonts?.ready.then(setOverride);
      const onScrollClear = () => {
        if (window.scrollY > window.innerHeight * 0.6) {
          (window as unknown as { __constellationRootOverride?: unknown }).__constellationRootOverride = null;
        } else {
          setOverride();
        }
      };
      window.addEventListener("scroll", onScrollClear, { passive: true });
      window.setTimeout(() => {
        (window as unknown as { __constellationRootOverride?: unknown }).__constellationRootOverride = null;
      }, 200);
      window.setTimeout(setOverride, 300);
    }

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
