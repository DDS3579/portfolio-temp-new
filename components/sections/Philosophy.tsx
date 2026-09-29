"use client";

import { useEffect, useRef } from "react";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { Reveal } from "@/components/motion/Reveal";

const STATEMENT = "I don't just build software. I build systems, products, and businesses.";

const rows = [
  { n: "01", p: "Clarity over complexity", d: "If it can't be explained simply, it isn't finished yet." },
  { n: "02", p: "Design with intent", d: "Every pixel, every transition, every line of copy earns its place." },
  { n: "03", p: "Engineer for scale", d: "Build the thing that survives being successful." },
];

export function Philosophy() {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.35)));
      const on = Math.floor(p * words.current.length * 1.25);
      words.current.forEach((w, i) => w.classList.toggle("on", i < on));
    };
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; update(); });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const tokens = STATEMENT.split(/\s+/);

  return (
    <section className="philosophy" id="philosophy" aria-labelledby="phil-title">
      <div className="wrap">
        <Reveal><SectionMarker label="Region: Philosophy" /></Reveal>
        <h2 className="phil-statement" id="phil-title" ref={ref} style={{ marginTop: "1.25rem" }}>
          {tokens.map((w, i) => (
            <span
              key={i}
              className="w"
              ref={(el) => { if (el) words.current[i] = el; }}
            >
              {w}{i < tokens.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>

        <div className="phil-rows">
          {rows.map((r) => (
            <Reveal key={r.n} delay={0.05}>
              <div className="phil-row">
                <span className="n">{r.n}</span>
                <span className="p">{r.p}</span>
                <span className="d">{r.d}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
