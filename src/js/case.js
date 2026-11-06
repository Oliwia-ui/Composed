// Case studies: one page per project, each dressed in that project's own colours and type.
import '../scss/main.scss';
import { RM, $, shuffle, matchCanvas } from './lib/env.js';
import { letters } from './lib/text.js';
import { startTypeplay } from './lib/typeplay.js';
import { gsap, smoothScroll, arrivedWithTransition, markTransition } from './lib/motion.js';
import { backLink } from './lib/back.js';
import { breathe, lingoDemo } from './pages/case-demos.js';

const cs = $('#case');
matchCanvas(cs);
backLink($('#cclose'), { index: '← back to home', work: '← back to selected work', process: '← back to my process' });

const title = $('#ctitle');
const vt = arrivedWithTransition();
const ls = letters(title);
title.dataset.ty = '';
startTypeplay();
breathe(cs);
lingoDemo(cs);
markTransition(cs.querySelectorAll('.cnext'));

if (!RM) {
  const rest = [...cs.children].filter(c => c !== title && c.id !== 'cclose' && c.id !== 'ccnum');
  // came from a list with the title already travelling into place? only bring in what's underneath
  if (!vt) { gsap.set(ls, { opacity: 0 }); gsap.to(shuffle(ls), { opacity: 1, duration: .01, stagger: .05, delay: .2 }); }
  gsap.from(rest, { opacity: 0, y: 40, duration: 1.2, stagger: .09, ease: 'power3.out', delay: vt ? .5 : .35, clearProps: 'opacity,transform' });
  smoothScroll();
}
