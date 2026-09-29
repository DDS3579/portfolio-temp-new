"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HeroFog } from "@/components/webgl/HeroFog";
import { lightState } from "@/lib/light-state";
import { site } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const IGNITE_EASE = [0.34, 1.56, 0.64, 1] as const;

const line = (d: number) => ({
  initial: { y: "115%", filter: "blur(10px)", scale: 0.96 },
  animate: { y: "0%", filter: "blur(0px)", scale: 1 },
  transition: { duration: 1.1, ease: EASE, delay: d },
});

export function Hero() {
  const periodRef = useRef<HTMLSpanElement>(null);
  const [bloomPos, setBloomPos] = useState<{ x: number; y: number } | null>(null);

  // measure the period's screen position for the bloom
  useEffect(() => {
    const measure = () => {
      const el = periodRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setBloomPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    };
    document.fonts?.ready.then(() => requestAnimationFrame(measure));
    const t = setTimeout(measure, 200);
    const ro = new ResizeObserver(measure);
    if (periodRef.current) ro.observe(periodRef.current);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // fog intensity ramp: 0 → 1 over 1.4s starting at 1.3s
  useEffect(() => {
    let rafId = 0;
    const startTime = performance.now() + 1300;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - startTime) / 1400));
      lightState.intensity = t;
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="hero wrap" id="hero" aria-labelledby="hero-title">
      <HeroFog />

      {/* Bloom ring — expands from the period on ignition */}
      {bloomPos && (
        <motion.div
          className="bloom-ring"
          style={{ left: bloomPos.x, top: bloomPos.y }}
          initial={{ opacity: 0, scale: 0.1, x: "-50%", y: "-50%" }}
          animate={{
            opacity: [0, 0.42, 0],
            scale: [0.1, 1, 1.15],
            x: "-50%",
            y: "-50%",
          }}
          transition={{
            duration: 1.8,
            delay: 1.3,
            times: [0, 0.2, 1],
            ease: EASE,
          }}
          aria-hidden="true"
        />
      )}

      <motion.p
        className="hero-label"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 1.6 }}
      >
        <span className="pulse" aria-hidden="true" />
        {site.role}
      </motion.p>

      <h1 className="hero-title" id="hero-title">
        <span className="hero-line">
          <motion.span style={{ display: "inline-block" }} {...line(0.3)}>
            I build businesses
          </motion.span>
        </span>
        <span className="hero-line">
          <motion.span style={{ display: "inline-block" }} {...line(0.44)}>
            from scratch to
          </motion.span>
        </span>
        <span className="hero-line">
          <motion.span style={{ display: "inline-block" }} {...line(0.58)}>
            conglomerates
            <motion.span
              ref={periodRef}
              id="hero-period"
              className="hero-period"
              initial={{ scale: 0.35, opacity: 0, filter: "blur(8px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.55, delay: 1.3, ease: IGNITE_EASE }}
            >
              .
            </motion.span>
          </motion.span>
        </span>
      </h1>

      <motion.p
        className="hero-sub"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 1.6 }}
      >
        Crafting products, systems, and digital experiences from first idea to scalable reality.
      </motion.p>

      <motion.div
        className="hero-ctas"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.9 }}
      >
        <a href="#work" className="btn btn-solid">
          View Work <span className="arrow" aria-hidden="true">→</span>
        </a>
        <a href="#contact" className="btn btn-ghost">
          Start a Project
        </a>
      </motion.div>

      <motion.div
        className="proof"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.9 }}
      >
        <span><span className="k">Digira:</span> 3 branches</span>
        <span><span className="k">NSS Clubs:</span> 56+ members</span>
        <span><span className="k">Kathmandu,</span> Nepal</span>
        <span><span className="k">Open</span> to projects</span>
      </motion.div>

      <motion.div
        className="scroll-cue"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.4 }}
      >
        <span>Scroll</span>
        <span className="bar" />
      </motion.div>
    </section>
  );
}
