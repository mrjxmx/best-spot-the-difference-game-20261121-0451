// game.js — the game itself: state, rendering, clicking, the clock, hints,
// scoring and the level flow for Second Glance.

import { LEVELS } from './levels.js';
import { playFound, playMiss, playHint, playWin, playTimeUp } from './audio.js';

const VIEW_W = 600;
const VIEW_H = 500;
const FOUND_BONUS_SECONDS = 8;
const MISS_PENALTY_SECONDS = 3;
const POINTS_PER_FIND = 100;

const els = {};
let state = null;

function variantMap(level, changed) {
  const map = {};
  for (const d of level.differences) map[d.id] = changed;
  return map;
}

function formatClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function remaining() {
  return state.level.differences.filter(d => !state.found.has(d.id));
}

function drawPanels() {
  const { level } = state;
  els.panelA.innerHTML = level.paint(variantMap(level, false), 'a');
  els.panelB.innerHTML = level.paint(variantMap(level, true), 'b');
  drawMarkers();
}

function markerMarkup(d, extraClass = '') {
  return `<circle class="marker-ring ${extraClass}" cx="${d.cx}" cy="${d.cy}" r="${Math.max(17, d.r * 0.62)}"/>
          <circle class="marker-dot" cx="${d.cx}" cy="${d.cy}" r="3.2"/>`;
}

function drawMarkers() {
  for (const svg of [els.panelA, els.panelB]) {
    svg.querySelectorAll('.marker-layer').forEach(n => n.remove());
    const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    layer.setAttribute('class', 'marker-layer');
    layer.innerHTML = state.level.differences
      .filter(d => state.found.has(d.id))
      .map(d => markerMarkup(d))
      .join('');
    svg.appendChild(layer);
  }
}

function transientOnBoth(markup) {
  for (const svg of [els.panelA, els.panelB]) {
    const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    layer.innerHTML = markup;
    svg.appendChild(layer);
    setTimeout(() => layer.remove(), 650);
  }
}

function updateChrome() {
  const left = remaining().length;
  const total = state.level.differences.length;
  els.levelChip.textContent = `Level ${state.levelIndex + 1} of ${LEVELS.length} · ${state.level.title}`;
  els.counterChip.textContent = left === 0
    ? 'All differences found!'
    : `${left} difference${left === 1 ? '' : 's'} to find · ${state.found.size} of ${total} found`;
  els.timerText.textContent = formatClock(state.timeLeft);
  els.timerBar.style.width = `${Math.max(0, (state.timeLeft / state.level.timeLimit) * 100)}%`;
  els.timerWrap.classList.toggle('low', state.timeLeft <= 30 && state.phase === 'playing');
  els.hintCount.textContent = String(state.hintsLeft);
  els.hintBtn.disabled = state.hintsLeft <= 0 || state.phase !== 'playing';
}

function say(text, kind = '') {
  els.message.textContent = text;
  els.message.className = `message ${kind}`;
}

function startLevel(index) {
  const level = LEVELS[index];
  state = {
    levelIndex: index,
    level,
    found: new Set(),
    hintsLeft: level.hints,
    timeLeft: level.timeLimit,
    mistakes: 0,
    score: state ? state.score : 0,
    phase: 'playing',
    lastTick: performance.now(),
  };
  drawPanels();
  updateChrome();
  hideOverlay();
  say(`${level.blurb} Each find earns +${FOUND_BONUS_SECONDS}s; a miss costs −${MISS_PENALTY_SECONDS}s.`);
}

function endLevel(won) {
  state.phase = won ? 'won' : 'lost';
  updateChrome();
  if (won) {
    playWin();
    const timeBonus = Math.ceil(state.timeLeft) * 2;
    state.score += timeBonus;
    const stars = state.mistakes === 0 && state.hintsLeft === state.level.hints ? 3
      : state.mistakes <= 2 ? 2 : 1;
    const last = state.levelIndex === LEVELS.length - 1;
    showOverlay(`
      <h2>${last ? 'Every scene solved!' : 'Level complete!'}</h2>
      <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p>${last
        ? `You cleared all ${LEVELS.length} scenes of Second Glance. Sharp eyes.`
        : `Every difference in ${state.level.title} is ringed.`}</p>
      <div class="stat-row">
        <span>Time left <b>${formatClock(state.timeLeft)}</b></span>
        <span>Misses <b>${state.mistakes}</b></span>
        <span>Score <b>${state.score}</b></span>
      </div>
      <button class="big-btn" id="nextBtn" type="button">${last ? 'Play again' : 'Next level'}</button>`);
    document.getElementById('nextBtn').addEventListener('click', () => {
      startLevel(last ? 0 : state.levelIndex + 1);
      if (last) state.score = 0;
    });
  } else {
    playTimeUp();
    showOverlay(`
      <h2>Time's up!</h2>
      <p>The clock beat you in ${state.level.title} with ${remaining().length} difference${remaining().length === 1 ? '' : 's'} still hiding.</p>
      <button class="big-btn" id="retryBtn" type="button">Try this level again</button>`);
    document.getElementById('retryBtn').addEventListener('click', () => startLevel(state.levelIndex));
  }
}

function showOverlay(html) {
  els.overlayCard.innerHTML = html;
  els.overlay.classList.add('show');
}

function hideOverlay() {
  els.overlay.classList.remove('show');
}

function showStart() {
  const params = new URLSearchParams(location.search);
  const startAt = Math.min(LEVELS.length - 1, Math.max(0, parseInt(params.get('level') || '1', 10) - 1 || 0));
  state = { levelIndex: startAt, level: LEVELS[startAt], found: new Set(), hintsLeft: 0, timeLeft: LEVELS[startAt].timeLimit, mistakes: 0, score: 0, phase: 'menu', lastTick: performance.now() };
  drawPanels();
  updateChrome();
  showOverlay(`
    <h1>Second Glance</h1>
    <p>Two pictures, side by side — and they are <b>not</b> quite the same.
    Click each difference you spot, in either picture, before the clock runs out.</p>
    <p>${LEVELS.length} scenes: a harbour at sunrise, a busy market square and a night observatory,
    each sneakier than the last. Finds earn time; misses cost it. Hints are few — spend them well.</p>
    <button class="big-btn" id="startBtn" type="button">Start hunting</button>`);
  document.getElementById('startBtn').addEventListener('click', () => startLevel(startAt));
}

function svgPoint(svg, event) {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * VIEW_W,
    y: ((event.clientY - rect.top) / rect.height) * VIEW_H,
  };
}

function handleClick(svg, wrap, event) {
  if (!state || state.phase !== 'playing') return;
  const p = svgPoint(svg, event);
  const hit = remaining()
    .map(d => ({ d, dist: Math.hypot(d.cx - p.x, d.cy - p.y) }))
    .filter(h => h.dist <= h.d.r)
    .sort((a, b) => a.dist - b.dist)[0];
  if (hit) {
    state.found.add(hit.d.id);
    state.score += POINTS_PER_FIND;
    state.timeLeft = Math.min(state.level.timeLimit, state.timeLeft + FOUND_BONUS_SECONDS);
    playFound();
    drawMarkers();
    transientOnBoth(`<circle class="flash-ring" cx="${hit.d.cx}" cy="${hit.d.cy}" r="${Math.max(20, hit.d.r * 0.62) + 12}"/>`);
    say(`Found: ${hit.d.label}. +${FOUND_BONUS_SECONDS}s`, 'good');
    updateChrome();
    if (remaining().length === 0) endLevel(true);
  } else {
    state.mistakes += 1;
    state.timeLeft = Math.max(0, state.timeLeft - MISS_PENALTY_SECONDS);
    playMiss();
    wrap.classList.remove('shake');
    void wrap.offsetWidth;
    wrap.classList.add('shake');
    const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    layer.innerHTML = `<path class="miss-mark" d="M ${p.x - 9} ${p.y - 9} L ${p.x + 9} ${p.y + 9} M ${p.x + 9} ${p.y - 9} L ${p.x - 9} ${p.y + 9}"/>`;
    svg.appendChild(layer);
    setTimeout(() => layer.remove(), 650);
    say(`Not there — −${MISS_PENALTY_SECONDS}s.`, 'bad');
    updateChrome();
    if (state.timeLeft <= 0) endLevel(false);
  }
}

function useHint() {
  if (!state || state.phase !== 'playing' || state.hintsLeft <= 0) return;
  const left = remaining();
  if (!left.length) return;
  const pick = left[Math.floor(Math.random() * left.length)];
  state.hintsLeft -= 1;
  playHint();
  transientOnBoth(`<circle class="hint-ring" cx="${pick.cx}" cy="${pick.cy}" r="${Math.max(19, pick.r * 0.7)}"/>`);
  say('Something glimmers… look inside the green ring.');
  updateChrome();
}

function tick(now) {
  if (state && state.phase === 'playing') {
    const elapsed = (now - state.lastTick) / 1000;
    state.timeLeft -= elapsed;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateChrome();
      endLevel(false);
    } else {
      updateChrome();
    }
  }
  if (state) state.lastTick = now;
  requestAnimationFrame(tick);
}

export function initGame() {
  els.panelA = document.getElementById('panelA');
  els.panelB = document.getElementById('panelB');
  els.wrapA = document.getElementById('wrapA');
  els.wrapB = document.getElementById('wrapB');
  els.levelChip = document.getElementById('levelChip');
  els.counterChip = document.getElementById('counterChip');
  els.timerText = document.getElementById('timerText');
  els.timerBar = document.getElementById('timerBar');
  els.timerWrap = document.querySelector('.timer-wrap');
  els.hintBtn = document.getElementById('hintBtn');
  els.hintCount = document.getElementById('hintCount');
  els.restartBtn = document.getElementById('restartBtn');
  els.message = document.getElementById('message');
  els.overlay = document.getElementById('overlay');
  els.overlayCard = document.getElementById('overlayCard');

  els.panelA.addEventListener('click', e => handleClick(els.panelA, els.wrapA, e));
  els.panelB.addEventListener('click', e => handleClick(els.panelB, els.wrapB, e));
  els.hintBtn.addEventListener('click', useHint);
  els.restartBtn.addEventListener('click', () => { if (state) startLevel(state.levelIndex); });
  window.addEventListener('keydown', e => {
    if (!state) return;
    if (e.key === 'h' || e.key === 'H') useHint();
    if (e.key === 'r' || e.key === 'R') startLevel(state.levelIndex);
    if ((e.key === 'n' || e.key === 'N' || e.key === 'Enter') && state.phase === 'won') {
      const btn = document.getElementById('nextBtn');
      if (btn) btn.click();
    }
    if (e.key === 'Enter' && state.phase === 'menu') {
      const btn = document.getElementById('startBtn');
      if (btn) btn.click();
    }
  });

  showStart();
  requestAnimationFrame(tick);
}
