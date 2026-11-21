// levels.js — the level registry: each entry names a scene painter, its
// difference list, its clock and its hint allowance, in play order.

import { paintHarbour, harbourDifferences } from './scenes-harbour.js';
import { paintMarket, marketDifferences } from './scenes-market.js';
import { paintObservatory, observatoryDifferences } from './scenes-observatory.js';

export const LEVELS = [
  {
    title: 'Harbour Morning',
    blurb: 'A quiet port at sunrise. Five things are not as they were.',
    paint: paintHarbour,
    differences: harbourDifferences,
    timeLimit: 150,
    hints: 2,
  },
  {
    title: 'Market Square',
    blurb: 'Market day, and seven things have shifted while you blinked.',
    paint: paintMarket,
    differences: marketDifferences,
    timeLimit: 200,
    hints: 2,
  },
  {
    title: 'Night Observatory',
    blurb: 'A still night, a watchful owl, and nine whispers of change.',
    paint: paintObservatory,
    differences: observatoryDifferences,
    timeLimit: 260,
    hints: 3,
  },
];
