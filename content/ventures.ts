export type Venture = {
  slug: string;
  name: string;
  category: string;
  desc: string;
  context: string;
  challenge: string;
  outcome: string;
  stack: string;
  links: { label: string; href: string }[];
};

export const primaryVentures: Venture[] = [
  {
    slug: "digiragency",
    name: "Digiragency",
    category: "Digira · Digital Agency",
    desc: "The agency arm of Digira — building digital products and AI systems for clients across Nepal and beyond.",
    context: "Client work needed backend depth and AI capability under one roof.",
    challenge: "Scaling delivery without losing craft or speed.",
    outcome: "A repeatable studio model — backend, AI agents, and finance systems.",
    stack: "Next.js / FastAPI / TypeScript / n8n / LangGraph / Claude API",
    links: [{ label: "Live", href: "https://digira.com.np" }],
  },
  {
    slug: "digira-esports",
    name: "Digira Esports",
    category: "Digira · Esports",
    desc: "Mobile Legends: Bang Bang tournaments across Nepal — brackets, broadcasts, and a competitive scene built from scratch.",
    context: "Nepali esports lacked organized, well-run tournament infrastructure.",
    challenge: "Running brackets, scheduling, and live ops without a large team.",
    outcome: "A repeatable tournament format with a growing player base.",
    stack: "Next.js / TypeScript / Tailwind / n8n",
    links: [{ label: "Live", href: "https://esports.digira.com.np" }],
  },
  {
    slug: "digira-education",
    name: "Digira Education",
    category: "Digira · Education",
    desc: "Teaching the next cohort of builders — practical, project-first curriculum for Nepali developers.",
    context: "Practical, project-first training was missing from the local market.",
    challenge: "Designing curriculum that maps to real hiring needs.",
    outcome: "A project-first program now in early cohorts.",
    stack: "Curriculum / Mentorship / Project-based",
    links: [],
  },
];

export const secondaryVentures = [
  { name: "NSS Clubs", role: "President · 56+ members · Events & Tech Fest", year: "2024" },
  { name: "Cozmos & Co.", role: "Design Internship", year: "2022" },
  { name: "MeroSEO", role: "Next.js Development Internship", year: "2022" },
];

export const labProjects = [
  {
    name: "KrishiSaathi",
    desc: "Nepali-language agricultural advisory paired with ESP32 IoT sensors — soil, climate, and crop guidance in the field.",
    stack: "ESP32 / IoT / Nepali NLP",
  },
  {
    name: "NeuroSync",
    desc: "A neuroplasticity and habit tracker with a 3D dotted-brain visualization that maps progress to structure.",
    stack: "TypeScript / 3D / Research",
  },
  {
    name: "Cognitive Mirror",
    desc: "A personal AI twin built with a cognitive-fidelity research layer — measuring how closely it thinks like you.",
    stack: "LLM / Agents / Evaluation",
  },
];
