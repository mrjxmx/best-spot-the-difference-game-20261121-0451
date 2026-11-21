# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mrjxmx/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mrjxmx/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Second Glance** — an original spot-the-difference game. Two near-identical pictures stand side by side; click each difference in either picture before the clock runs out. Three scenes of rising difficulty (Harbour Morning, 5 differences; Market Square, 7; Night Observatory, 9, smaller and quieter), drawn in code as parameterised SVG so the changed picture differs by exactly the planted changes. Finds ring both pictures, earn bonus time and play a synthesized chime; misses cost time; a limited hint button pulses a green ring; a level ends in a scored win card with stars, and the clock bar turns red as time runs short. Plain static files under `game/`, no build step, no network — every sound is synthesized with WebAudio.

## Run it

```sh
cd game && python3 -m http.server 8080   # or any static file server
# open http://localhost:8080 in a desktop browser and play
cd .. && mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # hand-in: copies game/ + screenshots/ and writes out/dossier.json
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=fj3hte3r&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
