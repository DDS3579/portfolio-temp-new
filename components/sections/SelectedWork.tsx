"use client";

import { SectionMarker } from "@/components/ui/SectionMarker";
import { Reveal } from "@/components/motion/Reveal";
import { labProjects, primaryVentures, secondaryVentures } from "@/content/ventures";

export function SelectedWork() {
  return (
    <section className="section-pad" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="work-head">
          <div>
            <Reveal><SectionMarker label="Region: Selected Work" /></Reveal>
            <Reveal delay={0.05}>
              <h2 className="h-display" id="work-title" style={{ marginTop: "1.25rem" }}>
                Selected Work
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="lede" style={{ maxWidth: "38ch" }}>
              A few projects that reflect product thinking, engineering, and design execution.
            </p>
          </Reveal>
        </div>

        {primaryVentures.map((v, i) => (
          <Reveal key={v.slug} delay={0.05}>
            <article className={"work-row lit " + (i % 2 === 1 ? "flip" : "")}>
              <div className="visual">
                <div className="work-visual">
                  <div className="chrome" aria-hidden="true"><i /><i /><i /></div>
                  <div className="art" aria-hidden="true">
                    <div className="grid-lines" />
                    <div className="blob" style={{
                      background:
                        i === 0
                          ? undefined
                          : i === 1
                          ? "radial-gradient(circle at 60% 40%, rgba(232,176,75,0.24), transparent 55%), radial-gradient(circle at 36% 66%, rgba(201,101,43,0.18), transparent 62%), radial-gradient(circle at 50% 50%, rgba(64,104,160,0.12), transparent 72%)"
                          : "radial-gradient(circle at 44% 40%, rgba(255,217,160,0.20), transparent 55%), radial-gradient(circle at 66% 62%, rgba(64,104,160,0.16), transparent 62%), radial-gradient(circle at 50% 50%, rgba(201,101,43,0.10), transparent 72%)",
                    }} />
                  </div>
                  <span className="slug">work/{v.slug}.webp</span>
                </div>
              </div>
              <div className="info work-info">
                <p className="cat"><span className="nd" aria-hidden="true" />{v.category}</p>
                <h3 className="h-display">{v.name}</h3>
                <p className="desc">{v.desc}</p>
                <div className="work-meta">
                  <div className="row"><span className="lbl">Context</span><span className="val">{v.context}</span></div>
                  <div className="row"><span className="lbl">Challenge</span><span className="val">{v.challenge}</span></div>
                  <div className="row"><span className="lbl">Outcome</span><span className="val">{v.outcome}</span></div>
                </div>
                <p className="stack">{v.stack}</p>
                {v.links.length > 0 && (
                  <div className="work-links">
                    {v.links.map((l) => (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                        {l.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}

        <div className="secondary">
          {secondaryVentures.map((s) => (
            <Reveal key={s.name} delay={0.03}>
              <div className="sec-row lit">
                <div>
                  <p className="nm">{s.name}</p>
                  <p className="rl">{s.role}</p>
                </div>
                <span className="yr">{s.year}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="lab">
          <Reveal><SectionMarker label="Region: Lab / Experiments" /></Reveal>
          <div className="lab-grid">
            {labProjects.map((p) => (
              <Reveal key={p.name} delay={0.05}>
                <article className="lab-card lit">
                  <p className="tag">Lab</p>
                  <h4>{p.name}</h4>
                  <p>{p.desc}</p>
                  <p className="st">{p.stack}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
