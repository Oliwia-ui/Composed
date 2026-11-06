// About, selected work, process, playground and hello: one script for every cube side.
import '../scss/main.scss';
import { RM, $, shuffle, matchCanvas } from './lib/env.js';
import { letters } from './lib/text.js';
import { startTypeplay } from './lib/typeplay.js';
import { gsap, smoothScroll, markTransition } from './lib/motion.js';
import { backLink } from './lib/back.js';
import { aboutModes } from './pages/about-modes.js';
import { tools } from './pages/tools.js';

const page = $('#bpage');
matchCanvas(page);
backLink($('#pclose'), { index: '← back to home' });

const title = page.querySelector('.pt');
const ls = letters(title, title.textContent, { plain: true });
startTypeplay();
aboutModes(page);
tools();
markTransition(page.querySelectorAll('[data-case]'));

// arriving from the cube: the title's letters surface one by one, the rest rises in underneath
if (!RM) {
  gsap.set(ls, { opacity: 0 });
  gsap.to(shuffle(ls), { opacity: 1, duration: .01, stagger: .045, delay: .1 });
  gsap.from(page.querySelectorAll('article.on .mpanel:not([hidden]) .pgrid, article.on > .pgrid, article.on > .modes'), { y: 40, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', delay: .2 });
  smoothScroll();
}
