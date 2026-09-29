"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HeroFog } from "@/components/webgl/HeroFog";
import { BloomCanvas } from "@/components/webgl/BloomCanvas";
import { lightState } from "@/lib/light-state";
import { site } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const IGNITE_EASE = [0.34, 1.56, 0.64, 1] as const;

const line = (d: number) => ({
  initial: { y: "115%", filter: "blur(10px)", scale: 0.96 },
  animate: { y: "0%", filter: "blur(0px)", scale: 1 },
  transition: { duration: 1.1, ease: EASE, delay: d },
});

function RoomDetails() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let rafId = 0;
    let frame = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      frame++;
      if (frame % 2 !== 0) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const lightX = lightState.x * w;
      const lightY = lightState.y * h;

      const scrollRatio = Math.min(1, window.scrollY / (h * 0.5));
      document.documentElement.style.setProperty(
        "--grain-boost",
        String(1 - scrollRatio)
      );

      const cue = document.querySelector<HTMLElement>(".scroll-cue");
      if (cue) {
        const r = cue.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(cx - lightX, cy - lightY);
        const glow = Math.max(0, 1 - d / 200);
        cue.style.setProperty("--cue-glow", glow.toFixed(3));
      }

      const buttons = document.querySelectorAll<HTMLElement>(".hero-ctas .btn");
      buttons.forEach((b) => {
        const r = b.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(cx - lightX, cy - lightY);
        const glow = Math.max(0, 1 - d / 300);
        b.style.setProperty("--btn-glow", glow.toFixed(3));
      });

      const proof = document.querySelector<HTMLElement>(".proof");
      if (proof) {
        const r = proof.getBoundingClientRect();
        proof.style.setProperty("--proof-lx", (lightX - r.left).toFixed(1) + "px");
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return null;
}

export function Hero() {
  const periodRef = useRef<HTMLSpanElement>(null);
  const [bloomPos, setBloomPos] = useState<{ x: number; y: number } | null>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // H5: front-layer parallax (skipped under reduce)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smx = useSpring(pointerX, { stiffness: 120, damping: 30 });
  const smy = useSpring(pointerY, { stiffness: 120, damping: 30 });
  const frontX = useTransform(smx, (v) => v * -6);
  const frontY = useTransform(smy, (v) => v * -6);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY, reduce]);

  // bloom ring position (skipped under reduce)
  useEffect(() => {
    if (reduce) return;
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
  }, [reduce]);

  // H2 + H6: intensity state machine (skipped under reduce)
  useEffect(() => {
    if (reduce) {
      // matches the static fog frame's intensity
      lightState.intensity = 0.85;
      return;
    }

    let rafId = 0;
    const startTime = performance.now() + 1300;
    let phase: "pre" | "ramp" | "steady" | "fade" = "pre";
    let intensityAtFadeStart = 1;
    let fadeOutStart = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const scrolled = window.scrollY > window.innerHeight * 0.35;

      if (phase === "pre") {
        lightState.intensity = 0;
        if (elapsed >= 0) phase = "ramp";
      } else if (phase === "ramp") {
        const t = Math.min(1, elapsed / 1400);
        lightState.intensity = t;
        if (t >= 1) phase = "steady";
        else if (scrolled) {
          intensityAtFadeStart = lightState.intensity;
          fadeOutStart = now;
          phase = "fade";
        }
      } else if (phase === "steady") {
        if (scrolled) {
          intensityAtFadeStart = lightState.intensity;
          fadeOutStart = now;
          phase = "fade";
        }
      } else if (phase === "fade") {
        const t = Math.min(1, (now - fadeOutStart) / 800);
        lightState.intensity = intensityAtFadeStart * (1 - t);
        if (t >= 1) {
          lightState.intensity = 0;
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduce]);

  return (
    <section className="hero wrap" id="hero" aria-labelledby="hero-title">
      <RoomDetails />
      <HeroFog />
      {!reduce && <BloomCanvas />}

      {!reduce && bloomPos && (
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

      <motion.div className="hero-front" style={reduce ? undefined : { x: frontX, y: frontY }}>
        <motion.p
          className="hero-label"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0.3, delay: 0.1 }
              : { duration: 0.7, ease: EASE, delay: 1.6 }
          }
        >
          <span className="pulse" aria-hidden="true" />
          {site.role}
        </motion.p>

        <h1 className="hero-title" id="hero-title">
          <span className="hero-line">
            <motion.span
              style={{ display: "inline-block" }}
              initial={reduce ? { opacity: 0 } : { y: "115%", filter: "blur(10px)", scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { y: "0%", filter: "blur(0px)", scale: 1 }}
              transition={
                reduce
                  ? { duration: 0.4, delay: 0.15 }
                  : { duration: 1.1, ease: EASE, delay: 0.3 }
              }
            >
              I build businesses
            </motion.span>
          </span>
          <span className="hero-line">
            <motion.span
              style={{ display: "inline-block" }}
              initial={reduce ? { opacity: 0 } : { y: "115%", filter: "blur(10px)", scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { y: "0%", filter: "blur(0px)", scale: 1 }}
              transition={
                reduce
                  ? { duration: 0.4, delay: 0.25 }
                  : { duration: 1.1, ease: EASE, delay: 0.44 }
              }
            >
              from scratch to
            </motion.span>
          </span>
          <span className="hero-line">
            <motion.span
              style={{ display: "inline-block" }}
              initial={reduce ? { opacity: 0 } : { y: "115%", filter: "blur(10px)", scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { y: "0%", filter: "blur(0px)", scale: 1 }}
              transition={
                reduce
                  ? { duration: 0.4, delay: 0.35 }
                  : { duration: 1.1, ease: EASE, delay: 0.58 }
              }
            >
              conglomerates
              {reduce && <span className="hero-period-halo" aria-hidden="true" />}
              <motion.span
                ref={periodRef}
                id="hero-period"
                className="hero-period"
                initial={reduce ? { opacity: 0 } : { scale: 0.35, opacity: 0, filter: "blur(8px)" }}
                animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={
                  reduce
                    ? { duration: 0.4, delay: 0.45 }
                    : { duration: 0.55, delay: 1.3, ease: IGNITE_EASE }
                }
              >
                .
              </motion.span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0.4, delay: 0.5 }
              : { duration: 0.7, ease: EASE, delay: 1.6 }
          }
        >
          Crafting products, systems, and digital experiences from first idea to scalable reality.
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0.4, delay: 0.6 }
              : { duration: 0.8, ease: EASE, delay: 1.9 }
          }
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
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0.4, delay: 0.7 }
              : { duration: 0.8, ease: EASE, delay: 1.9 }
          }
        >
          <span><span className="k">Digira:</span> 3 branches</span>
          <span><span className="k">NSS Clubs:</span> 56+ members</span>
          <span><span className="k">Kathmandu,</span> Nepal</span>
          <span><span className="k">Open</span> to projects</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-cue"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0.4, delay: 0.8 } : { duration: 0.8, delay: 2.4 }}
      >
        <span>Scroll</span>
        <span className="bar" />
      </motion.div>
    </section>
  );
}
