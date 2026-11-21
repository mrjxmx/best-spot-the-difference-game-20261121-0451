// scenes-harbour.js — Level 1, "Harbour Morning": a lighthouse, boats and gulls.
// paint(variant, uid) draws the scene; variant maps difference ids to booleans
// (all false = the original, all true = the changed picture).

import { cloud, gull } from './svg-helpers.js';

export const harbourDifferences = [
  { id: 'stripe', cx: 128, cy: 292, r: 30, label: 'the lighthouse stripe changed colour' },
  { id: 'rays', cx: 508, cy: 76, r: 48, label: 'the sun lost its rays' },
  { id: 'boat', cx: 255, cy: 318, r: 42, label: 'the little blue boat vanished' },
  { id: 'gull', cx: 352, cy: 152, r: 26, label: 'an extra gull joined the flock' },
  { id: 'flag', cx: 142, cy: 196, r: 26, label: 'the lighthouse flag flipped' },
];

function lighthouse(v) {
  const band = v.stripe ? '#1f9e8f' : '#e0483e';
  const flag = v.flag
    ? '<polygon points="128,182 104,189 128,196" fill="#e0483e"/>'
    : '<polygon points="128,182 152,189 128,196" fill="#e0483e"/>';
  return `<g>
    <polygon points="86,368 170,368 158,258 98,258" fill="#f4f1e6"/>
    <polygon points="93,318 163,318 158,258 98,258" fill="${band}"/>
    <polygon points="89,348 167,348 170,368 86,368" fill="#e0483e"/>
    <rect x="98" y="222" width="60" height="38" fill="#33445c"/>
    <rect x="112" y="230" width="32" height="24" fill="#ffe9a3"/>
    <polygon points="90,222 166,222 128,198" fill="#22314a"/>
    <rect x="126" y="180" width="4" height="20" fill="#22314a"/>
    ${flag}
    <rect x="118" y="286" width="20" height="30" rx="9" fill="#33445c"/>
  </g>`;
}

function sailboat(x, y, s, hull, sail, gone) {
  if (gone) return '';
  return `<g>
    <polygon points="${x - 34 * s},${y} ${x + 34 * s},${y} ${x + 22 * s},${y + 14 * s} ${x - 22 * s},${y + 14 * s}" fill="${hull}"/>
    <rect x="${x - 2 * s}" y="${y - 62 * s}" width="${4 * s}" height="${62 * s}" fill="#5a4230"/>
    <polygon points="${x + 4 * s},${y - 60 * s} ${x + 4 * s},${y - 4 * s} ${x + 34 * s},${y - 4 * s}" fill="${sail}"/>
    <polygon points="${x - 4 * s},${y - 52 * s} ${x - 4 * s},${y - 4 * s} ${x - 26 * s},${y - 4 * s}" fill="#ffffff"/>
  </g>`;
}

export function paintHarbour(v, uid) {
  const rays = v.rays ? '' : `<g stroke="#f5b921" stroke-width="5" stroke-linecap="round">
    ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
      const rad = (a * Math.PI) / 180;
      const x1 = 508 + Math.cos(rad) * 44, y1 = 76 + Math.sin(rad) * 44;
      const x2 = 508 + Math.cos(rad) * 60, y2 = 76 + Math.sin(rad) * 60;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }).join('')}
  </g>`;
  const extraGull = v.gull ? gull(352, 152, 1.1) : '';
  return `
  <defs>
    <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#e6f6fd"/>
    </linearGradient>
    <linearGradient id="sea-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3d9db8"/><stop offset="1" stop-color="#1f6f8f"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="600" height="302" fill="url(#sky-${uid})"/>
  ${rays}
  <circle cx="508" cy="76" r="34" fill="#ffd94d" stroke="#f5b921" stroke-width="4"/>
  ${cloud(96, 66, 1)}
  ${cloud(292, 44, 0.72)}
  ${cloud(448, 148, 0.6)}
  ${gull(202, 92, 1)}${gull(252, 122, 0.8)}${gull(392, 82, 0.9)}${gull(152, 152, 0.75)}${gull(482, 196, 0.8)}
  ${extraGull}
  <rect x="0" y="296" width="600" height="204" fill="url(#sea-${uid})"/>
  <g stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.5" fill="none">
    <path d="M 30 330 q 14 -8 28 0 t 28 0"/><path d="M 210 356 q 14 -8 28 0 t 28 0"/>
    <path d="M 420 300 q 14 -8 28 0 t 28 0"/><path d="M 90 402 q 14 -8 28 0 t 28 0"/>
    <path d="M 500 420 q 14 -8 28 0 t 28 0"/><path d="M 300 452 q 14 -8 28 0 t 28 0"/>
  </g>
  <path d="M 0 452 Q 200 430 360 448 T 600 442 L 600 500 L 0 500 Z" fill="#f2d492"/>
  <ellipse cx="128" cy="392" rx="86" ry="26" fill="#8d99a6"/>
  <ellipse cx="96" cy="382" rx="40" ry="16" fill="#a7b2bd"/>
  ${lighthouse(v)}
  <g>
    <rect x="0" y="352" width="86" height="10" fill="#8a6844"/>
    <rect x="10" y="362" width="8" height="34" fill="#6f5436"/>
    <rect x="58" y="362" width="8" height="34" fill="#6f5436"/>
  </g>
  <g>
    <rect x="436" y="352" width="118" height="66" fill="#fdf6e3"/>
    <polygon points="426,352 564,352 495,306" fill="#b8502f"/>
    <rect x="480" y="378" width="26" height="40" fill="#6f5436"/>
    <rect x="452" y="364" width="20" height="20" fill="#ffe9a3" stroke="#6f5436" stroke-width="2"/>
    <rect x="522" y="322" width="14" height="24" fill="#c9ced6"/>
    <path d="M 529 318 q 10 -12 2 -22 q 12 -8 6 -20" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.8" stroke-linecap="round"/>
  </g>
  ${sailboat(322, 384, 1, '#8a4b2a', '#e0483e', false)}
  ${sailboat(255, 322, 0.66, '#3c5a74', '#2f80ed', v.boat)}
  <g>
    <ellipse cx="238" cy="428" rx="16" ry="10" fill="#e0483e"/>
    <rect x="222" y="420" width="32" height="7" fill="#ffffff"/>
    <rect x="235" y="402" width="5" height="20" fill="#8a6844"/>
  </g>`;
}
