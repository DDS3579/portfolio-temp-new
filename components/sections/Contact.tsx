"use client";

import { useState } from "react";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/content/site";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <Reveal><SectionMarker label="Region: Contact" /></Reveal>
            <Reveal delay={0.05}>
              <h2 id="contact-title" style={{ marginTop: "1.25rem" }}>
                Let's build something exceptional.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="pitch">
                Open to collaborations, product ideas, and ambitious projects.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="contact-actions">
                <a href="#contact-form" className="btn btn-solid">
                  Start a Project <span className="arrow" aria-hidden="true">→</span>
                </a>
                <a href={site.socials.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
                  View GitHub
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="socials">
                <a href={site.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                <a href={site.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
                <a href={site.socials.x} target="_blank" rel="noreferrer">X ↗</a>
                <a href={"mailto:" + site.email}>Email ↗</a>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="foot-coords" style={{ marginTop: "2rem" }}>
                {site.location.city} · {site.location.lat.toFixed(4)}° N, {site.location.lng.toFixed(4)}° E
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form
              className={"form lit " + (sent ? "sent" : "")}
              id="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              noValidate
            >
              <div className="form-body">
                <div className="field">
                  <label htmlFor="f-name">Name</label>
                  <input id="f-name" name="name" type="text" placeholder="Your name" required autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email</label>
                  <input id="f-email" name="email" type="email" placeholder="you@company.com" required autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="f-type">Project type</label>
                  <select id="f-type" name="type" defaultValue="Product / MVP">
                    <option>Product / MVP</option>
                    <option>Web / App</option>
                    <option>AI / Agents</option>
                    <option>Consulting</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="f-msg">Message</label>
                  <textarea id="f-msg" name="message" placeholder="Tell me what you're building…" required />
                </div>
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px" }}
                />
                <button type="submit" className="btn btn-solid">
                  Send message <span className="arrow" aria-hidden="true">→</span>
                </button>
                <p className="form-note">Or email {site.email}</p>
              </div>
              <div className="form-success" role="status">
                Message received. I'll be in touch.
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
