// Home: the scroll story with the cube as navigation.
import '../scss/main.scss';
import { RM, $ } from './lib/env.js';
import { letters, words, typeify, wordify } from './lib/text.js';
import { startTypeplay } from './lib/typeplay.js';
import { ScrollTrigger, smoothScroll, getLenis, markTransition } from './lib/motion.js';
import { makeCube } from './home/cube.js';
import { heroIntro, scenes } from './home/scenes.js';
import { workThumb } from './home/work-thumb.js';
import { startSnow } from './home/snow.js';

// Safari: once you scroll past the start, quiet the cube behind the text
if (document.documentElement.classList.contains('noblend')) {
  const h = document.documentElement, f = () => h.classList.toggle('past', scrollY > innerHeight * .6);
  addEventListener('scroll', f, { passive: true }); f();
}

/* ---------- build the type ---------- */
const wordEl = $('#word');
const L = letters(wordEl, 'composed');
const fit = () => { // "composed" fills the width, whatever the screen
  const w = wordEl.clientWidth;
  wordEl.style.fontSize = '100px';
  const nat = [...wordEl.children].reduce((a, s) => a + s.getBoundingClientRect().width, 0);
  const fs = Math.min(100 * w / nat * 0.985, innerHeight * 0.62);
  wordEl.style.fontSize = fs + 'px';
  $('#hero').style.setProperty('--wordH', (fs * 0.76) + 'px');
};
fit();
const sayW = words($('#say'), 'I have a lot going on in my head. I turn it into things that make sense to someone else.');
const helpW = words($('#help'), 'a few ideas I got a little too invested in.');
const quietW = words($('#quiet'), 'less noise. more meaning.');
const overW = words($('#over'), "let's talk.");
quietW.slice(3).forEach(w => w.classList.add('lit'));
const deeper = $('#deeper');
deeper.innerHTML = 'd' + '<span class="e">e</span>'.repeat(6) + 'p<span class="e">e</span>r';
const Es = [...deeper.querySelectorAll('.e')];

document.querySelectorAll('.ghost').forEach(wordify);
['#say', '#help', '#quiet', '#over', '#swap', '#about .row'].forEach(q => document.querySelectorAll(q).forEach(typeify));
// only a few pieces of type are restless; the rest stays still so these stand out
[wordEl, $('#about .row'), $('#swap')].forEach(el => el && (el.dataset.ty = ''));
startTypeplay();

workThumb();
markTransition(document.querySelectorAll('.wlist a'));

if (RM) {
  Es.forEach(e => e.classList.add('on'));
  makeCube({ live: false, getLenis });
} else {
  smoothScroll();
  heroIntro({ L });
  scenes({ L, sayW, helpW, quietW, overW, Es });
  makeCube({ live: true, getLenis });
  startSnow();
  addEventListener('resize', () => { fit(); ScrollTrigger.refresh(); });
  document.fonts && document.fonts.ready.then(() => { fit(); ScrollTrigger.refresh(); });
}
