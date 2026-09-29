import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { MotionConfigProvider } from "@/components/motion/MotionConfigProvider";
import { Constellation } from "@/components/constellation/Constellation";
import { site } from "@/content/site";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-google",
  display: "swap",
});
const body = Geist({ subsets: ["latin"], variable: "--font-body-google", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-google", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: site.name + " — " + site.role,
    template: "%s · " + site.name,
  },
  description:
    "I build businesses from scratch to conglomerates. Founder & Full Stack Developer, Kathmandu, Nepal.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.domain,
    title: site.name + " — " + site.role,
    description: "I build businesses from scratch to conglomerates.",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name + " — " + site.role,
    description: "I build businesses from scratch to conglomerates.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: site.domain,
    address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.x],
  };

  return (
    <html lang="en" className={display.variable + " " + body.variable + " " + mono.variable}>
      <body>
        <a href="#main" className="sr-only">Skip to content</a>
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-fog" aria-hidden="true" />
        <Constellation />
        <div className="bg-grain" aria-hidden="true" />

        <MotionConfigProvider>
          <LenisProvider>{children}</LenisProvider>
        </MotionConfigProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
