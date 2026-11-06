// About: the tools grid. Tiles flip in like cards being dealt, names scramble before they settle,
// hovering a tile wiggles its logo.
import { gsap } from '../lib/motion.js';
import { RM } from '../lib/env.js';

export function tools() {
  const T = document.querySelector('.tools'); if (!T) return;
  const tiles = [...T.querySelectorAll('.tl')], AZ = 'abcdefghijklmnopqrstuvwxyz';
  tiles.forEach(t => { t._b = t.querySelector('span'); t._s = t._b.textContent; });
  const scramble = (t, dur) => {
    if (RM) return; const t0 = performance.now(), fin = t._s; cancelAnimationFrame(t._raf);
    (function f(now) {
      const p = (now - t0) / dur; if (p >= 1) { t._b.textContent = fin; return; }
      t._b.textContent = [...fin].map((c, i) => c === ' ' || c === '·' || c === '.' || p > (i + 1) / (fin.length + 1) ? c : AZ[Math.random() * 26 | 0]).join('');
      t._raf = requestAnimationFrame(f);
    })(t0);
  };
  let played = false;
  const play = () => {
    if (played || RM) return; played = true;
    gsap.fromTo(tiles, { opacity: 0, rotateX: -95, y: 40, transformPerspective: 700, transformOrigin: '50% 100%' },
      { opacity: 1, rotateX: 0, y: 0, duration: .9, ease: 'back.out(1.7)', stagger: { each: .05, from: 'start' }, clearProps: 'transform,opacity' });
    tiles.forEach((t, i) => setTimeout(() => scramble(t, 650), 120 + i * 50));
  };
  // play when the grid shows up; again if you switch to "after hours" and back
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) play(); else if (!e.target.offsetParent) played = false; }), { threshold: .15 }).observe(T);
  tiles.forEach(t => t.addEventListener('pointerenter', () => {
    scramble(t, 380);
    if (!RM) gsap.fromTo(t.querySelector('.ic'), { rotate: 0, scale: 1 }, { keyframes: [{ rotate: -12, scale: 1.15, duration: .12 }, { rotate: 10, duration: .12 }, { rotate: 0, scale: 1, duration: .35, ease: 'back.out(3)' }] });
  }));
}
