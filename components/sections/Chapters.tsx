"use client";

import { useEffect, useRef } from "react";

const chapters = [
  {
    n: "1",
    region: "Region: Origin",
    coord: "27.7172° N",
    title: "Every empire starts with a first line of code.",
    body: "Before the branches, before the teams — there was a laptop, a problem worth solving, and the stubbornness to ship it.",
  },
  {
    n: "2",
    region: "Region: Build",
    title: "Design. Engineer. Ship.",
    body: "Internships at Cozmos & Co. and MeroSEO sharpened the craft — design systems, Next.js, and the discipline of finishing.",
  },
  {
    n: "3",
    region: "Region: Scale",
    title: "From product to business.",
    body: "Digira grew from a single agency into three branches — Digiragency, Digira Esports, and Digira Education.",
  },
  {
    n: "4",
    region: "Region: Conglomerate",
    title: "Ambition becomes infrastructure.",
    body: "The Digira umbrella now carries an agency, an esports org, and an education arm — with a research Lab building what comes next.",
  },
];

export function Chapters() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const rail = railRef.current;
    if (!section || !track || !rail) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      const wide = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
      if (reduce || !wide) {
        track.style.transform = "";
        return;
      }
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;
      if (total <= 0) return;
      const rect = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / total));
      track.style.transform = "translate3d(" + (-p * 75).toFixed(3) + "vw, 0, 0)";

      const idx = Math.min(3, Math.floor(p * 4 + 0.0001));
      const ticks = rail.querySelectorAll<HTMLElement>(".rail-tick");
      ticks.forEach((t, i) => {
        t.classList.toggle("active", i === idx);
        t.classList.toggle("done", i < idx);
      });
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

  return (
    <section className="chapters" id="chapters" ref={sectionRef} aria-labelledby="chapters-title">
      <h2 id="chapters-title" className="sr-only">Chapters</h2>
      <div className="chapters-sticky">
        <div className="chapters-track" ref={trackRef}>
          {chapters.map((c) => (
            <article className="chapter" key={c.n}>
              <span className="chapter-num" aria-hidden="true">{c.n}</span>
              <div className="chapter-body">
                <p className="marker">
                  {c.region}
                  {c.coord ? <span className="coord">{c.coord}</span> : null}
                </p>
                <h3 className="h-display">{c.title}</h3>
                <p>{c.body}</p>
              </div>
              <div className="chapter-visual" aria-hidden="true" />
            </article>
          ))}
        </div>
        <div className="chapters-rail" ref={railRef} aria-hidden="true">
          {["Origin", "Build", "Scale", "Conglomerate"].map((t, i) => (
            <div className="rail-tick" key={t} data-tick={i}>
              <span className="bar" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
