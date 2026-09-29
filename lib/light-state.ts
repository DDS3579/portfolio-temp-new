/**
 * Shared mutable light state. Written by the constellation engine
 * and the Hero timeline; read by the WebGL fog. Lives outside React
 * on purpose — updated every frame, so a module object is correct.
 */
export const lightState = {
  /** normalized 0..1 across viewport width  */
  x: 0.5,
  /** normalized 0..1 across viewport height (top-down) */
  y: 0.6,
  /** 0..1 — fog/warm ramp. Rises during hero ignition. */
  intensity: 0,
};
