// Type that won't sit still: a few pieces of type keep changing face and colour,
// and any letter you touch inverts for a moment.
import { RM, shuffle } from './env.js';
import { state } from './text.js';

// faces: f1 hairline, f2 serif italic, f3 mono, f4 didone italic, f5 condensed, f6 expanded. colours: c1 blue, c2 outline, c3 grey
const FACES = ['', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6'], COLS = ['', '', 'c1', 'c2', 'c3'];
const ALL = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'c1', 'c2', 'c3'];
const SEQ = ['', 'f1 c1', '', 'mix', 'f2', 'f5 c2', '', 'f4 c1', 'mix', 'f3', '', 'f6 c1', 'f2 c3', 'mix', '', 'f4', 'f5', 'f1 c2'];
const pick = a => a[(Math.random() * a.length) | 0];
const rnd = () => (pick(FACES) + ' ' + pick(COLS)).trim();
const setT = (l, st) => { if (!l) return; l.classList.remove(...ALL); st && st.split(' ').forEach(c => c && l.classList.add(c)); };
const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; };

// a letter doesn't just switch: it flickers through a few random looks first, then lands
function jump(ls, final, delay) {
  const n = 4 + ((Math.random() * 6) | 0);
  for (let j = 0; j < n; j++) setTimeout(() => { const r = rnd(); ls.forEach(l => setT(l, r)); }, delay + j * 75);
  setTimeout(() => ls.forEach(l => setT(l, final)), delay + n * 75);
}

export function startTypeplay() {
  let ph = 0;
  if (!RM) setInterval(() => {
    if (document.hidden) return;
    ph = (ph + 1) % SEQ.length; const look = SEQ[ph]; state.cls = look === 'mix' ? '' : look;
    document.querySelectorAll('[data-ty]').forEach(el => {
      const live = onScreen(el);
      const groups = [...el.querySelectorAll('.l')].map(l => [l]);
      shuffle(groups).forEach((g, k) => {
        const fin = look === 'mix' ? (Math.random() < .35 ? '' : rnd()) : look;
        live ? jump(g, fin, k * Math.min(110, 1400 / groups.length)) : g.forEach(l => setT(l, fin));
      });
    });
  }, 3200);

  document.addEventListener('pointerover', e => {
    const t = e.target.closest && e.target.closest('.l,.gw'); if (!t) return;
    t.classList.add('inv'); clearTimeout(t._iv); t._iv = setTimeout(() => t.classList.remove('inv'), 700);
  });
}
