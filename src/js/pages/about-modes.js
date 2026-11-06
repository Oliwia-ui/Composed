// About: two sides of the same person. Office hours (light) and after hours (dark).
import { gsap } from '../lib/motion.js';
import { RM } from '../lib/env.js';

const MODES = { office: ['#fafaf9', '#0b0b0b'], after: ['#0b0b0b', '#fafaf9'] };

export function aboutModes(page) {
  const art = page.querySelector('article[data-p="about"]'); if (!art) return;
  const grounds = [page, document.body, document.documentElement];
  function setMode(m, first) {
    page.dataset.mode = m; page.style.setProperty('--pbg', MODES[m][0]); page.style.setProperty('--pfg', MODES[m][1]);
    if (!RM && !first) gsap.to(grounds, { backgroundColor: MODES[m][0], color: MODES[m][1], duration: .7, ease: 'power2.out', overwrite: true });
    else grounds.forEach(g => { g.style.backgroundColor = MODES[m][0]; g.style.color = MODES[m][1]; });
    art.querySelectorAll('.mode').forEach(b => { const on = b.dataset.mode === m; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    art.querySelectorAll('.mpanel').forEach(p => {
      const on = p.dataset.mode === m; p.hidden = !on;
      if (on && !RM && !first) gsap.from(p.querySelectorAll('.pgrid'), { y: 30, opacity: 0, duration: .8, stagger: .08, ease: 'expo.out' });
    });
  }
  art.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  setMode('office', true);
}
