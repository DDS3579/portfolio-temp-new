"use client";

import { useEffect, useRef } from "react";
import { lightState } from "@/lib/light-state";

/**
 * Persistent bloom around the light source. Sits inside the hero,
 * draws exactly one radial at lightState.x/y (which follows the
 * drifting period node), amplitude from lightState.intensity.
 * Disabled under reduced motion.
 */
export function BloomCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let W = 0;
    let H = 0;
    let DPR = 1;

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width || window.innerWidth;
      H = r.height || window.innerHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      const intensity = lightState.intensity;
      if (intensity < 0.01) return;

      const x = lightState.x * W;
      const y = lightState.y * H;

      // breathing matches the shader's 6s cycle, ±5%
      const breath = 0.85 + 0.15 * Math.sin((t / 1000) * 1.047);
      const alpha = 0.42 * intensity * breath;
      const R = 220 + 40 * breath;

      const g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, "rgba(255, 217, 160, " + alpha + ")");
      g.addColorStop(0.35, "rgba(232, 176, 75, " + alpha * 0.35 + ")");
      g.addColorStop(1, "rgba(232, 176, 75, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="bloom-canvas" ref={ref} aria-hidden="true" />;
}
