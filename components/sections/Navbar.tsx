"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["work", "capabilities", "journey", "contact"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleAnchor = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const id = href.replace(/^#/, "");
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (el: HTMLElement, opts?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header>
        <nav className={"nav " + (scrolled ? "scrolled" : "")} aria-label="Primary">
          <div className="nav-inner">
            <a href="#hero" className="brand" onClick={handleAnchor("#hero")} aria-label="DDS — home">
              <span className="dot" aria-hidden="true" />
              DDS
            </a>
            <div className="nav-links">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={"nav-link " + (active === item.href.slice(1) ? "active" : "")}
                  onClick={handleAnchor(item.href)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <a href={site.cta.href} className="nav-cta" onClick={handleAnchor(site.cta.href)}>
              {site.cta.label}
            </a>
            <button
              className={"menu-btn " + (open ? "open" : "")}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </header>

      <div className={"sheet " + (open ? "open" : "")} role="dialog" aria-modal="true" aria-label="Menu">
        {site.nav.map((item) => (
          <a key={item.href} href={item.href} onClick={handleAnchor(item.href)}>
            {item.label}
          </a>
        ))}
        <a href={site.cta.href} onClick={handleAnchor(site.cta.href)}>{site.cta.label}</a>
      </div>
    </>
  );
}
