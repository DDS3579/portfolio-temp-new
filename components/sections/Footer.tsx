import { site } from "@/content/site";

export function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <span>© {site.name}</span>
        <span className="foot-coords">
          {site.location.lat.toFixed(4)}° N, {site.location.lng.toFixed(4)}° E
        </span>
        <span>Built with Next.js</span>
        <a href="#hero">Back to top ↑</a>
      </div>
    </footer>
  );
}
