import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Chapters } from "@/components/sections/Chapters";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Capabilities } from "@/components/sections/Capabilities";
import { Journey } from "@/components/sections/Journey";
import { Philosophy } from "@/components/sections/Philosophy";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { SHOW_TESTIMONIALS } from "@/content/site";

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Chapters />
        <SelectedWork />
        <Capabilities />
        <Journey />
        <Philosophy />
        {SHOW_TESTIMONIALS ? null : null}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
