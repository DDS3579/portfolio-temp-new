"use client";

import { motion } from "motion/react";
import { HeroFog } from "@/components/webgl/HeroFog";
import { site } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const line = (d: number) => ({
  initial: { y: "110%" },
  animate: { y: "0%" },
  transition: { duration: 1.05, ease: EASE, delay: d },
});

export function Hero() {
  return (
    <section className="hero wrap" id="hero" aria-labelledby="hero-title">
      <HeroFog />

      <motion.p
        className="hero-label"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
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
          <motion.span style={{ display: "inline-block" }} {...line(0.42)}>
            from scratch to
          </motion.span>
        </span>
        <span className="hero-line">
          <motion.span style={{ display: "inline-block" }} {...line(0.54)}>
            conglomerates
            <motion.span
              id="hero-period"
              className="hero-period"
              initial={{ scale: 0.2, opacity: 0, filter: "blur(6px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: EASE, delay: 1.3 }}
            >
              .
            </motion.span>
          </motion.span>
        </span>
      </h1>

      <motion.p
        className="hero-sub"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.6 }}
      >
        Crafting products, systems, and digital experiences from first idea to scalable reality.
      </motion.p>

      <motion.div
        className="hero-ctas"
        initial={{ opacity: 0, y: 16 }}
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
        transition={{ duration: 0.8, delay: 2.6 }}
      >
        <span>Scroll</span>
        <span className="bar" />
      </motion.div>
    </section>
  );
}
