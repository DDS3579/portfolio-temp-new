"use client";

import { useState } from "react";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { Reveal } from "@/components/motion/Reveal";
import { capabilities } from "@/content/capabilities";

export function Capabilities() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-pad" id="capabilities" aria-labelledby="cap-title">
      <div className="wrap">
        <Reveal><SectionMarker label="Region: Capabilities" /></Reveal>
        <Reveal delay={0.05}>
          <h2 className="h-display" id="cap-title" style={{ marginTop: "1.25rem", maxWidth: "16ch" }}>
            What I actually do, end to end.
          </h2>
        </Reveal>

        <div className="cap-grid">
          <div className="cap-list" role="tablist" aria-label="Disciplines">
            {capabilities.map((c, i) => (
              <button
                key={c.name}
                role="tab"
                aria-selected={active === i}
                className={"cap-item " + (active === i ? "active" : "")}
                onMouseEnter={() => {
                  if (window.matchMedia("(min-width: 1024px)").matches) setActive(i);
                }}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="idx">0{i + 1}</span>
                <span className="nm">{c.name}</span>
              </button>
            ))}
          </div>

          <div className="cap-detail">
            {capabilities.map((c, i) => (
              <div key={c.name} className={"cap-panel " + (active === i ? "active" : "")}>
                <h4>{c.heading}</h4>
                <p>{c.body}</p>
                <div className="cap-tags">
                  {c.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
