// Exact geometric account; no fitted diffusion constant or elapsed time.
export function cubeAccount(side, depth) {
  const coreSide=Math.max(side-2*depth,0);
  return { area:6*side*side, volume:side**3, ratio:6/side, coreSide,
    reached:1-(coreSide/side)**3 };
}
