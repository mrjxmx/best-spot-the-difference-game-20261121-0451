// svg-helpers.js — tiny string builders for shapes several scenes reuse.
// Every painter returns SVG markup as a string; these keep the scenes terse.

// A soft oval cloud centred at (x, y); s scales it.
export function cloud(x, y, s, fill = '#ffffff') {
  return `<g fill="${fill}" opacity="0.95">
    <ellipse cx="${x}" cy="${y}" rx="${46 * s}" ry="${17 * s}"/>
    <ellipse cx="${x - 26 * s}" cy="${y + 5 * s}" rx="${28 * s}" ry="${12 * s}"/>
    <ellipse cx="${x + 28 * s}" cy="${y + 5 * s}" rx="${30 * s}" ry="${13 * s}"/>
    <ellipse cx="${x + 2 * s}" cy="${y - 10 * s}" rx="${26 * s}" ry="${14 * s}"/>
  </g>`;
}

// A distant gull: two arcs meeting at a point.
export function gull(x, y, s, colour = '#3c5a74') {
  return `<path d="M ${x - 11 * s} ${y} Q ${x - 5 * s} ${y - 7 * s} ${x} ${y} Q ${x + 5 * s} ${y - 7 * s} ${x + 11 * s} ${y}"
    fill="none" stroke="${colour}" stroke-width="${2.2 * s}" stroke-linecap="round"/>`;
}

// A four-point sparkle star, for night skies.
export function sparkle(x, y, r, fill = '#ffeeb0') {
  return `<path d="M ${x} ${y - r} L ${x + r * 0.28} ${y - r * 0.28} L ${x + r} ${y} L ${x + r * 0.28} ${y + r * 0.28} L ${x} ${y + r} L ${x - r * 0.28} ${y + r * 0.28} L ${x - r} ${y} L ${x - r * 0.28} ${y - r * 0.28} Z" fill="${fill}"/>`;
}

// A small round star.
export function star(x, y, r, fill = '#ffffff', opacity = 0.9) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${opacity}"/>`;
}

// Deterministic pseudo-random numbers in [0, 1), so both panels and every
// reload draw the identical sky.
export function seededRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// A pine tree silhouette with its tip at (x, y) and height h.
export function pine(x, y, h, fill = '#0e2a22') {
  const w = h * 0.34;
  return `<g fill="${fill}">
    <polygon points="${x},${y} ${x - w / 2},${y + h * 0.45} ${x + w / 2},${y + h * 0.45}"/>
    <polygon points="${x},${y + h * 0.22} ${x - w * 0.58},${y + h * 0.72} ${x + w * 0.58},${y + h * 0.72}"/>
    <polygon points="${x},${y + h * 0.45} ${x - w * 0.62},${y + h} ${x + w * 0.62},${y + h}"/>
    <rect x="${x - 3}" y="${y + h}" width="6" height="${h * 0.12}" fill="#241a12"/>
  </g>`;
}
