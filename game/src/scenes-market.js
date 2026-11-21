// scenes-market.js — Level 2, "Market Square": stalls, a clock tower and a cat.
// paint(variant, uid) draws the scene; variant maps difference ids to booleans
// (all false = the original, all true = the changed picture).

import { cloud } from './svg-helpers.js';

export const marketDifferences = [
  { id: 'clock', cx: 308, cy: 118, r: 32, label: 'the clock tells a different time' },
  { id: 'awning', cx: 300, cy: 238, r: 40, label: 'the middle awning changed colour' },
  { id: 'balloon', cx: 548, cy: 196, r: 34, label: 'a balloon went missing' },
  { id: 'cat', cx: 176, cy: 428, r: 30, label: 'the cat slipped away' },
  { id: 'bunting', cx: 300, cy: 54, r: 24, label: 'one bunting flag changed colour' },
  { id: 'crates', cx: 402, cy: 412, r: 32, label: 'an extra crate of oranges appeared' },
  { id: 'lamp', cx: 574, cy: 232, r: 26, label: 'the street lamp lit up' },
];

function awning(x, y, w, colourA, colourB) {
  const stripes = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    stripes.push(`<polygon points="${x + (w / n) * i},${y} ${x + (w / n) * (i + 1)},${y} ${x + (w / n) * (i + 1) - 4},${y + 26} ${x + (w / n) * i - 4},${y + 26}" fill="${i % 2 ? colourA : colourB}"/>`);
  }
  return `<g>${stripes.join('')}<rect x="${x - 6}" y="${y + 24}" width="${w + 12}" height="6" fill="#5a4230"/></g>`;
}

function stall(x, colourA, colourB, goods) {
  return `<g>
    <rect x="${x}" y="252" width="8" height="150" fill="#6f5436"/>
    <rect x="${x + 142}" y="252" width="8" height="150" fill="#6f5436"/>
    ${awning(x - 12, 226, 174, colourA, colourB)}
    <rect x="${x - 8}" y="330" width="166" height="16" fill="#8a6844"/>
    <rect x="${x - 8}" y="346" width="166" height="56" fill="#a87f52"/>
    ${goods}
  </g>`;
}

function fruitCrate(x, y, colour, count) {
  const dots = [];
  const spots = [[12, 10], [26, 8], [40, 10], [19, 20], [33, 20], [12, 22], [40, 22]];
  for (let i = 0; i < count; i++) dots.push(`<circle cx="${x + spots[i][0]}" cy="${y + spots[i][1]}" r="6.5" fill="${colour}"/>`);
  return `<g><rect x="${x}" y="${y}" width="52" height="30" fill="#b08a58" stroke="#8a6844" stroke-width="2"/>${dots.join('')}</g>`;
}

function bunting(v) {
  const colours = ['#e0483e', '#57c96b', '#2f80ed', '#ffd94d', '#e0483e', '#57c96b', '#2f80ed'];
  if (v.bunting) colours[3] = '#ff8ac2';
  const flags = colours.map((c, i) => {
    const x = 60 + i * 80;
    return `<polygon points="${x},${34 + Math.sin(i * 0.9) * 7} ${x + 40},${40 + Math.sin((i + 0.5) * 0.9) * 7} ${x + 20},${66 + Math.sin(i * 0.9) * 7}" fill="${c}"/>`;
  });
  return `<path d="M 20 30 Q 300 78 580 30" fill="none" stroke="#5a4230" stroke-width="2.5"/>${flags.join('')}`;
}

function clockHands(v) {
  // Base: ten past ten. Changed: twenty to three.
  const hour = v.clock ? 84 : -54;
  const minute = v.clock ? 240 : 60;
  const hand = (angle, len, w) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return `<line x1="308" y1="118" x2="${(308 + Math.cos(rad) * len).toFixed(1)}" y2="${(118 + Math.sin(rad) * len).toFixed(1)}" stroke="#22314a" stroke-width="${w}" stroke-linecap="round"/>`;
  };
  return hand(hour, 13, 4.5) + hand(minute, 19, 3) + '<circle cx="308" cy="118" r="3.4" fill="#22314a"/>';
}

function cat(v) {
  if (v.cat) return '';
  return `<g>
    <ellipse cx="176" cy="440" rx="24" ry="13" fill="#e8913a"/>
    <circle cx="158" cy="424" r="12" fill="#e8913a"/>
    <polygon points="149,416 152,404 158,413" fill="#e8913a"/>
    <polygon points="160,413 166,403 168,415" fill="#e8913a"/>
    <circle cx="154" cy="423" r="1.8" fill="#22314a"/><circle cx="163" cy="423" r="1.8" fill="#22314a"/>
    <path d="M 198 442 q 18 -4 14 -20" fill="none" stroke="#e8913a" stroke-width="5" stroke-linecap="round"/>
  </g>`;
}

function balloons(v) {
  const bunch = [
    { x: 532, y: 168, c: '#e0483e' }, { x: 556, y: 156, c: '#2f80ed' },
    { x: 572, y: 178, c: '#ffd94d' }, { x: 544, y: 140, c: '#57c96b' },
  ];
  const shown = v.balloon ? bunch.slice(0, 3) : bunch;
  return `<g>${shown.map(b => `<line x1="548" y1="238" x2="${b.x}" y2="${b.y + 16}" stroke="#5a4230" stroke-width="1.6"/><ellipse cx="${b.x}" cy="${b.y}" rx="13" ry="16" fill="${b.c}"/>`).join('')}</g>`;
}

function lamp(v) {
  const glow = v.lamp ? '<circle cx="574" cy="232" r="21" fill="#ffe9a3" opacity="0.55"/><circle cx="574" cy="232" r="10" fill="#ffd94d"/>' : '<circle cx="574" cy="232" r="10" fill="#cfd8e2"/>';
  return `<g><rect x="571" y="242" width="6" height="168" fill="#33445c"/><rect x="556" y="216" width="36" height="8" rx="4" fill="#33445c"/>${glow}<rect x="566" y="222" width="16" height="6" fill="#33445c"/></g>`;
}

export function paintMarket(v, uid) {
  const middleAwning = v.awning ? ['#9b59d0', '#ffffff'] : ['#3f9e58', '#ffffff'];
  const extraCrate = v.crates ? fruitCrate(376, 396, '#f28c28', 6) : '';
  return `
  <defs>
    <linearGradient id="msky-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a8d8f0"/><stop offset="1" stop-color="#fdf3d8"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="600" height="500" fill="url(#msky-${uid})"/>
  ${cloud(120, 108, 0.8)}${cloud(486, 84, 0.66)}
  <g fill="#b9c9d6">
    <rect x="8" y="150" width="86" height="196" /><rect x="506" y="140" width="88" height="206"/>
    <rect x="120" y="176" width="64" height="170"/><rect x="416" y="170" width="60" height="176"/>
  </g>
  <rect x="0" y="342" width="600" height="158" fill="#cbb9a0"/>
  <g stroke="#b3a184" stroke-width="2" fill="none" opacity="0.8">
    <path d="M 0 386 Q 300 372 600 386"/><path d="M 0 434 Q 300 420 600 434"/><path d="M 0 478 Q 300 466 600 478"/>
  </g>
  ${bunting(v)}
  <g>
    <rect x="284" y="70" width="48" height="196" fill="#d9b48c"/>
    <polygon points="276,70 340,70 308,34" fill="#8a4b2a"/>
    <circle cx="308" cy="118" r="27" fill="#fdf6e3" stroke="#8a4b2a" stroke-width="4"/>
    ${clockHands(v)}
    <rect x="298" y="176" width="20" height="34" fill="#6f5436"/>
    <rect x="290" y="228" width="36" height="24" fill="#ffe9a3" stroke="#8a4b2a" stroke-width="2"/>
  </g>
  ${stall(28, '#e0483e', '#ffffff', fruitCrate(44, 296, '#e0483e', 7) + fruitCrate(108, 296, '#f28c28', 6))}
  ${stall(218, middleAwning[0], middleAwning[1], fruitCrate(234, 296, '#57c96b', 6) + fruitCrate(298, 296, '#9b59d0', 5))}
  ${stall(408, '#2f80ed', '#ffffff', '<g fill="#e8c07a"><ellipse cx="440" cy="312" rx="17" ry="10"/><ellipse cx="478" cy="312" rx="17" ry="10"/><ellipse cx="512" cy="312" rx="17" ry="10"/></g>')}
  ${fruitCrate(40, 410, '#f28c28', 6)}
  ${fruitCrate(104, 410, '#e0483e', 5)}
  ${extraCrate}
  ${cat(v)}
  ${balloons(v)}
  ${lamp(v)}
  <g fill="#5a6b80">
    <ellipse cx="330" cy="452" rx="9" ry="5"/><ellipse cx="352" cy="446" rx="7" ry="4"/>
    <ellipse cx="238" cy="466" rx="8" ry="4.5"/>
  </g>`;
}
