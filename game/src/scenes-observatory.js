// scenes-observatory.js — Level 3, "Night Observatory": moon, planets and an owl.
// paint(variant, uid) draws the scene; variant maps difference ids to booleans
// (all false = the original, all true = the changed picture). The differences
// here are deliberately smaller and quieter than the earlier levels.

import { sparkle, star, seededRandom, pine } from './svg-helpers.js';

export const observatoryDifferences = [
  { id: 'star', cx: 250, cy: 58, r: 22, label: 'a bright star winked out' },
  { id: 'crater', cx: 108, cy: 68, r: 24, label: 'a moon crater smoothed away' },
  { id: 'planet', cx: 472, cy: 92, r: 36, label: 'the ringed planet tilted its rings' },
  { id: 'comet', cx: 336, cy: 128, r: 38, label: 'the comet swung its tail the other way' },
  { id: 'dome', cx: 492, cy: 290, r: 42, label: 'the dome slit turned to face the other way' },
  { id: 'telescope', cx: 412, cy: 246, r: 32, label: 'the telescope dipped its nose' },
  { id: 'window', cx: 138, cy: 420, r: 24, label: 'a cabin window went dark' },
  { id: 'owl', cx: 208, cy: 348, r: 26, label: 'the owl closed its eyes' },
  { id: 'firefly', cx: 522, cy: 428, r: 28, label: 'fireflies gathered on the east hill' },
];

function starField() {
  const rnd = seededRandom(20261121);
  const dots = [];
  for (let i = 0; i < 110; i++) {
    const x = (rnd() * 600).toFixed(0);
    const y = (rnd() * 300).toFixed(0);
    const r = (0.8 + rnd() * 1.5).toFixed(1);
    dots.push(star(x, y, r, '#ffffff', (0.35 + rnd() * 0.6).toFixed(2)));
  }
  return dots.join('');
}

function moon(v) {
  const crater = v.crater ? '' : '<circle cx="108" cy="68" r="7" fill="#d9d2b8"/>';
  return `<g>
    <circle cx="95" cy="85" r="40" fill="#f4f1de"/>
    <circle cx="78" cy="98" r="9" fill="#ddd6bd"/>
    <circle cx="112" cy="104" r="5.5" fill="#ddd6bd"/>
    ${crater}
    <circle cx="88" cy="60" r="4" fill="#e3dcc4"/>
  </g>`;
}

function planet(v) {
  const tilt = v.planet ? 20 : -20;
  return `<g>
    <ellipse cx="472" cy="92" rx="34" ry="10" fill="none" stroke="#c9a2e0" stroke-width="4" transform="rotate(${tilt} 472 92)"/>
    <circle cx="472" cy="92" r="17" fill="#d9a066"/>
    <path d="M 458 84 a 17 17 0 0 1 28 0" fill="#c78d4e"/>
    <ellipse cx="472" cy="92" rx="34" ry="10" fill="none" stroke="#e3c8f2" stroke-width="2.4" transform="rotate(${tilt} 472 92)" stroke-dasharray="60 200" stroke-dashoffset="-96"/>
  </g>`;
}

function comet(v) {
  const tail = v.comet
    ? '<path d="M 342 122 L 396 92 M 344 130 L 402 116 M 340 136 L 388 138" stroke="#a8d8f0" stroke-width="3.4" stroke-linecap="round"/>'
    : '<path d="M 330 122 L 276 92 M 328 130 L 270 116 M 332 136 L 284 138" stroke="#a8d8f0" stroke-width="3.4" stroke-linecap="round"/>';
  return `<g>${tail}<circle cx="336" cy="128" r="8" fill="#eaf7ff"/><circle cx="336" cy="128" r="13" fill="#a8d8f0" opacity="0.3"/></g>`;
}

function observatory(v) {
  const slitAngle = v.dome ? 24 : -24;
  const scopeAngle = v.telescope ? 12 : 34;
  return `<g>
    <rect x="408" y="346" width="172" height="14" fill="#33445c"/>
    <rect x="416" y="350" width="152" height="42" fill="#46536a"/>
    <path d="M 416 350 A 76 76 0 0 1 568 350 Z" fill="#5b6b84"/>
    <g transform="rotate(${slitAngle} 492 350)">
      <rect x="484" y="262" width="16" height="92" rx="8" fill="#141c2c"/>
    </g>
    <g transform="rotate(${scopeAngle} 472 285)">
      <rect x="376" y="276" width="96" height="18" rx="9" fill="#c9d4e2"/>
      <rect x="366" y="279" width="13" height="12" rx="3" fill="#33445c"/>
      <rect x="462" y="272" width="15" height="26" rx="5" fill="#8fa2ba"/>
    </g>
    <rect x="522" y="360" width="24" height="32" fill="#2c3a4e"/>
    <rect x="528" y="366" width="12" height="12" fill="#ffe9a3"/>
  </g>`;
}

function cabin(v) {
  const rightWindow = v.window ? '#2c3a4e' : '#ffe9a3';
  return `<g>
    <rect x="42" y="392" width="128" height="66" fill="#4a3826"/>
    <polygon points="32,392 180,392 106,352" fill="#2e2118"/>
    <rect x="58" y="404" width="24" height="24" fill="#ffe9a3" stroke="#2e2118" stroke-width="3"/>
    <rect x="126" y="404" width="24" height="24" fill="${rightWindow}" stroke="#2e2118" stroke-width="3"/>
    <rect x="94" y="416" width="20" height="42" fill="#2e2118"/>
    <rect x="140" y="362" width="13" height="24" fill="#6b5138"/>
    <path d="M 146 356 q 8 -10 1 -18 q 10 -7 4 -16" fill="none" stroke="#cfd8e2" stroke-width="3.4" opacity="0.6" stroke-linecap="round"/>
  </g>`;
}

function owl(v) {
  const eyes = v.owl
    ? '<path d="M 200 344 l 6 0 M 212 344 l 6 0" stroke="#ffe9a3" stroke-width="2.2" stroke-linecap="round"/>'
    : '<circle cx="203" cy="344" r="2.6" fill="#ffe9a3"/><circle cx="215" cy="344" r="2.6" fill="#ffe9a3"/>';
  return `<g>
    <path d="M 168 358 Q 230 344 268 362" stroke="#241a12" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="209" cy="350" rx="13" ry="15" fill="#6b5138"/>
    <ellipse cx="209" cy="354" rx="8" ry="10" fill="#a3805a"/>
    <polygon points="198,338 202,330 206,338" fill="#6b5138"/>
    <polygon points="212,338 216,330 220,338" fill="#6b5138"/>
    ${eyes}
    <polygon points="206,348 212,348 209,352" fill="#e8a33d"/>
  </g>`;
}

function fireflies(v) {
  const west = [[64, 470], [96, 482], [128, 468], [250, 476], [286, 462]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#d8f79a" opacity="0.9"/>`).join('');
  const east = v.firefly ? [[498, 420], [524, 436], [548, 418], [512, 448], [556, 442]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#d8f79a" opacity="0.9"/>`).join('') : '';
  return `<g>${west}${east}</g>`;
}

export function paintObservatory(v, uid) {
  const brightStar = v.star ? '' : sparkle(250, 58, 13);
  return `
  <defs>
    <linearGradient id="night-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b1035"/><stop offset="1" stop-color="#27356e"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="600" height="500" fill="url(#night-${uid})"/>
  ${starField()}
  ${brightStar}
  ${sparkle(540, 170, 9, '#ffffff')}
  ${sparkle(160, 190, 8, '#ffffff')}
  ${moon(v)}
  ${planet(v)}
  ${comet(v)}
  <path d="M 0 402 Q 160 366 330 396 T 600 384 L 600 500 L 0 500 Z" fill="#131f1a"/>
  <path d="M 0 448 Q 220 420 420 442 T 600 436 L 600 500 L 0 500 Z" fill="#0b140f"/>
  ${pine(36, 356, 74)}${pine(196, 372, 58)}${pine(316, 380, 66)}${pine(580, 356, 70)}
  ${observatory(v)}
  ${cabin(v)}
  ${owl(v)}
  ${fireflies(v)}`;
}
