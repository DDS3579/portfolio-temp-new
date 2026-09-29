"use client";

import { useEffect, useRef, useState } from "react";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { Reveal } from "@/components/motion/Reveal";
import { journey } from "@/content/journey";

export function Journey() {
  const [active, setActive] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      let idx = 0;
      entryRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.55) idx = i;
      });
      setActive(idx);

      if (fillRef.current && entriesRef.current && entryRefs.current[0]) {
        const first = entryRefs.current[0]!.getBoundingClientRect();
        const last = entryRefs.current[entryRefs.current.length - 1]!.getBoundingClientRect();
        const total = last.top - first.top;
        const passed = Math.min(total, Math.max(0, vh * 0.55 - first.top));
        fillRef.current.style.height = passed + "px";
      }
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

  const current = journey[active]!;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="section-pad" id="journey" aria-labelledby="journey-title">
      <div className="wrap">
        <Reveal><SectionMarker label="Region: Journey" /></Reveal>
        <Reveal delay={0.05}>
          <h2 className="h-display" id="journey-title" style={{ marginTop: "1.25rem", maxWidth: "16ch" }}>
            The build log.
          </h2>
        </Reveal>

        <div className="journey-grid">
          <div className="journey-left">
            <p className="journey-year">
              {current.year}<span className="dash"> — </span>Now
            </p>
            <p className="journey-log">log {pad(active + 1)} / {pad(journey.length)}</p>
            <p className="journey-role">{current.role}</p>
          </div>

          <div className="journey-entries" ref={entriesRef}>
            <div className="journey-rail-fill" ref={fillRef} aria-hidden="true" />
            {journey.map((j, i) => (
              <article
                key={j.year + "-" + i}
                className={"j-entry " + (active === i ? "active" : "")}
                ref={(el) => { entryRefs.current[i] = el; }}
              >
                <p className="when">{j.when}</p>
                <h4>{j.title}</h4>
                <p className="org">{j.org}</p>
                <p>{j.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
