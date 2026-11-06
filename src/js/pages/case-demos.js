// The little things you can try inside a case study.
import { RM } from '../lib/env.js';

// Garmin Sense: the breathing orb, 6.5 breaths a minute, only runs while it's on screen
export function breathe(cs) {
  const orb = cs.querySelector('#orb'); if (!orb) return;
  const bar = cs.querySelector('#bbar'), bw = cs.querySelector('#bword'), ot = cs.querySelector('#orbt');
  (function loop() {
    requestAnimationFrame(loop);
    const r = orb.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const cyc = 60 / 6.5, t = (performance.now() / 1000) % cyc, half = cyc / 2, inhale = t < half, p = inhale ? t / half : (t - half) / half;
    const e = .5 - Math.cos(Math.PI * p) / 2, sc = RM ? .78 : (inhale ? .55 + .45 * e : 1 - .45 * e);
    orb.style.transform = `scale(${sc})`;
    bar.style.transform = `scaleX(${p})`;
    const w = inhale ? 'breathe in' : 'breathe out';
    if (bw.textContent !== w) { bw.textContent = w; ot.textContent = inhale ? 'in' : 'out'; }
  })();
}

// Spotify-Lingo: one round of the game
export function lingoDemo(cs) {
  const demo = cs.querySelector('#lingoDemo'); if (!demo) return;
  demo.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const ok = b.hasAttribute('data-ok'); b.classList.add(ok ? 'ok' : 'no');
    if (ok) { demo.querySelector('#lgap').textContent = b.dataset.w; demo.querySelector('#lmsg').textContent = 'nice. that one came from the same line.'; }
    else demo.querySelector('#lmsg').textContent = 'not quite. the wrong ones come from the same song, so they sound right.';
  }));
}
