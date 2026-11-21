// Second Glance — hand-in program (Node 22, standard library only).
//
// The game lives in game/ as plain static files (game/index.html and its ES
// modules; no build step, no network). This program copies game/ and
// screenshots/ into the output directory and writes dossier.json there with
// buildDossier from the vendored make.fun library, so the grader sees exactly
// the files the judge will read about.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR names the output directory:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The gate's own limits, passed to the dossier builder so an entry the
// scorer would refuse is refused here first.
const GATE_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy one entry folder (game/, screenshots/) from the repository into the
// output directory, creating the destination even when the source is absent.
function copyEntryFolder(name) {
  const from = join(repoDir, name);
  const to = join(outputDir, name);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyEntryFolder('game');
copyEntryFolder('screenshots');

const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(dossierPath, buildDossier(outputDir, GATE_LIMITS));
if (!existsSync(dossierPath)) throw new Error('dossier.json was not written');
