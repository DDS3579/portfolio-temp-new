export const NODE_IDS = [
  "root", "agency", "esports", "education", "nss",
  "lab-krishi", "lab-neurosync", "lab-mirror",
  "h-nav", "h-hero", "h-card-a", "h-card-b", "h-rail", "h-foot", "h-aux", "h-meta",
] as const;

export type NodeId = (typeof NODE_IDS)[number];
export type StateKey =
  | "hero" | "origin" | "build" | "scale" | "conglomerate"
  | "work" | "journey" | "contact";

type P = { x: number; y: number; o: number };
const P = (x: number, y: number, o = 1): P => ({ x, y, o });

export const STATES: Record<StateKey, P[]> = {
  hero: [
    P(.5, .62), P(.5, .62, 0), P(.5, .62, 0), P(.5, .62, 0),
    P(.5, .62, 0), P(.5, .62, 0), P(.5, .62, 0), P(.5, .62, 0),
    P(.5, .62, 0), P(.5, .62, 0), P(.5, .62, 0), P(.5, .62, 0),
    P(.5, .62, 0), P(.5, .62, 0), P(.5, .62, 0), P(.5, .62, 0),
  ],
  origin: [
    P(.25, .5), P(.25, .5, 0), P(.25, .5, 0), P(.25, .5, 0),
    P(.25, .5, 0), P(.25, .5, 0), P(.25, .5, 0), P(.25, .5, 0),
    P(.25, .5, 0), P(.25, .5, 0), P(.25, .5, 0), P(.25, .5, 0),
    P(.25, .5, 0), P(.25, .5, 0), P(.25, .5, 0), P(.25, .5, 0),
  ],
  build: [
    P(.14, .16), P(.14, .36), P(.14, .56), P(.14, .76),
    P(.46, .28), P(.46, .52), P(.74, .28), P(.74, .52),
    P(.14, .10), P(.46, .16), P(.74, .62), P(.74, .76),
    P(.46, .76), P(.74, .16), P(.46, .90), P(.14, .90),
  ],
  scale: [
    P(.5, .5), P(.28, .32), P(.72, .32), P(.5, .72),
    P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0),
    P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0),
    P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0),
  ],
  conglomerate: [
    P(.5, .5), P(.28, .32), P(.72, .32), P(.5, .72),
    P(.2, .62), P(.32, .82), P(.68, .82), P(.8, .62),
    P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0),
    P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0), P(.5, .5, 0),
  ],
  work: [
    P(.88, .16), P(.88, .28), P(.88, .40), P(.88, .52),
    P(.88, .64), P(.88, .76), P(.92, .86), P(.92, .94),
    P(.88, .16, 0), P(.88, .16, 0), P(.88, .16, 0), P(.88, .16, 0),
    P(.88, .16, 0), P(.88, .16, 0), P(.88, .16, 0), P(.88, .16, 0),
  ],
  journey: [
    P(.12, .18), P(.12, .28), P(.12, .38), P(.12, .48),
    P(.12, .58), P(.12, .68), P(.12, .78), P(.12, .88),
    P(.12, .18, 0), P(.12, .18, 0), P(.12, .18, 0), P(.12, .18, 0),
    P(.12, .18, 0), P(.12, .18, 0), P(.12, .18, 0), P(.12, .18, 0),
  ],
  contact: [
    P(.68, .38), P(.68, .38, .15), P(.68, .38, .15), P(.68, .38, .15),
    P(.68, .38, .1), P(.68, .38, .1), P(.68, .38, .1), P(.68, .38, .1),
    P(.68, .38, 0), P(.68, .38, 0), P(.68, .38, 0), P(.68, .38, 0),
    P(.68, .38, 0), P(.68, .38, 0), P(.68, .38, 0), P(.68, .38, 0),
  ],
};

export const EDGES: Record<StateKey, [number, number][]> = {
  hero: [],
  origin: [],
  build: [[0,1],[1,2],[2,3],[0,4],[4,5],[4,6],[6,7],[1,4],[8,9],[9,10],[10,11],[12,13],[13,14]],
  scale: [[0,1],[0,2],[0,3]],
  conglomerate: [[0,1],[0,2],[0,3],[0,4],[4,5],[4,6],[4,7],[1,2],[2,3]],
  work: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]],
  journey: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]],
  contact: [],
};

export const LABELS: Partial<Record<NodeId, string>> = {
  root: "Digira",
  agency: "Digiragency",
  esports: "Esports",
  education: "Education",
  nss: "NSS Clubs",
  "lab-krishi": "KrishiSaathi",
  "lab-neurosync": "NeuroSync",
  "lab-mirror": "Cognitive Mirror",
};

// Global mutable bus for cross-component signalling (hero period anchor).
export const constellationBus: {
  rootOverride: { x: number; y: number } | null;
  state: StateKey;
} = {
  rootOverride: null,
  state: "hero",
};
