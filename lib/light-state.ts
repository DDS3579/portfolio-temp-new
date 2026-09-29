/**
 * Shared mutable light state. Written by the constellation engine,
 * read by the WebGL fog. Lives outside React on purpose — it's
 * updated every animation frame, so a module object is correct,
 * not React state.
 */
export const lightState = {
  /** normalized 0..1 across viewport width  */
  x: 0.5,
  /** normalized 0..1 across viewport height */
  y: 0.6,
};
