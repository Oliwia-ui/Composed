// The home page scroll: six scenes, from a busy head down into the deep and back up.
import { gsap, ScrollTrigger } from '../lib/motion.js';
import { $, shuffle } from '../lib/env.js';

export function heroIntro({ L }) {
  gsap.set(L, { opacity: 0 });
  gsap.set('#t1', { clipPath: 'inset(0 100% 0 0)' });
  gsap.set('#heroLine', { scaleX: 0 });
  // intro so the first frame isn't empty
  gsap.timeline({ delay: .2 })
    .to('#heroLine', { scaleX: 1, duration: 1, ease: 'expo.inOut' })
    .to('#t1', { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'steps(18)' }, '-=.3')
    .to(shuffle(L).slice(0, 2), { opacity: 1, duration: .01, stagger: .18 }, '-=.2');
}

export function scenes({ L, sayW, helpW, quietW, overW, Es }) {
  /* depth readout: the page is a dive */
  const depthEl = $('#depth');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
    const p = s.progress, d = p < .82 ? p / .82 * 32 : 32 - (p - .82) / .18 * 32;
    depthEl.textContent = (p > .98 ? 0 : d).toFixed(1) + ' m';
  } });

  /* 1. hero: letters surface one by one */
  const order = shuffle(L.map((_, i) => i));
  const htl = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=180%', pin: '#hero .pin', scrub: true } });
  order.forEach((i, k) => htl.to(L[i], { opacity: 1, duration: .02 }, .1 + k * .1));
  htl.to('#hero .ghostblock', { yPercent: -18, filter: 'blur(4px)', duration: 1 }, 0)
    .to('#t2', { opacity: 0, duration: .1 }, .9)
    .to('#word', { yPercent: -6, duration: .3 }, 1.15);

  /* 2. about */
  gsap.set(sayW, { opacity: 0 });
  const atl = gsap.timeline({ scrollTrigger: { trigger: '#about', start: 'top top', end: '+=170%', pin: '#about .pin', scrub: true,
    onUpdate: s => { const n = Math.round(gsap.utils.mapRange(.45, .95, 0, Es.length, s.progress)); Es.forEach((e, i) => e.classList.toggle('on', i < n)); } } });
  atl.from('#about .hline.a', { scaleX: 0, duration: .2 }, 0)
    .from('#about .list div', { xPercent: -8, opacity: 0, stagger: .04, duration: .15 }, 0);
  sayW.forEach((w, k) => atl.to(w, { opacity: 1, duration: .02 }, .12 + k * .06));
  atl.from('#about .hline.b', { scaleX: 0, duration: .3 }, .4)
    .to('#about .list', { yPercent: -10, duration: 1 }, 0);

  /* 3. vision: loud thoughts compose into one sentence */
  vision();

  /* 4. work */
  gsap.set(helpW, { opacity: 0 });
  const wtl = gsap.timeline({ scrollTrigger: { trigger: '#work', start: 'top 70%', end: 'top 15%', scrub: true } });
  helpW.forEach((w, k) => wtl.to(w, { opacity: 1, duration: .02 }, k * .12));
  gsap.from('.wlist li', { yPercent: 60, opacity: 0, stagger: .12, duration: 1.1, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.wlist', start: 'top 85%' } });

  /* 5. deep: page inverts below the thermocline */
  ScrollTrigger.create({ trigger: '#deep', start: 'top 55%', end: 'bottom 45%', toggleClass: { targets: document.body, className: 'deep' } });
  gsap.set(quietW, { opacity: 0 });
  const dtl = gsap.timeline({ scrollTrigger: { trigger: '#deep', start: 'top 40%', end: 'bottom bottom', scrub: true } });
  dtl.from('#deep .hline', { scaleX: 0, stagger: .1, duration: .3 }, 0);
  quietW.forEach((w, k) => dtl.to(w, { opacity: 1, duration: .02 }, .2 + k * .12));

  /* 6. contact: resurface, chaos → structure */
  gsap.set(overW, { opacity: 0 }); gsap.set('#why', { opacity: 0 });
  const ctl = gsap.timeline({ scrollTrigger: { trigger: '#contact', start: 'top 65%', end: 'top 5%', scrub: true } });
  overW.forEach((w, k) => ctl.to(w, { opacity: 1, duration: .02 }, k * .1));
  let shown = false;
  ScrollTrigger.create({ trigger: '#contact .foot', start: 'top 92%',
    onEnter: () => { if (!shown) { shown = true; gsap.to('#why', { opacity: 1, duration: .6, delay: .7 }); } },
    onLeaveBack: () => { shown = false; gsap.to('#why', { opacity: 0, duration: .3 }); } });
}

function vision() {
  const sent = $('#vsent'), noise = $('#vnoise');
  const parts = []; // split the sentence into words, keeping the blue key phrase
  [...sent.childNodes].forEach(n => {
    const key = n.nodeType === 1;
    n.textContent.trim().split(/\s+/).forEach(w => { if (!w) return; const sp = document.createElement('span'); sp.className = 'vw' + (key ? ' key' : ''); sp.textContent = w; parts.push(sp); });
  });
  sent.setAttribute('aria-label', sent.textContent.replace(/\s+/g, ' ').trim()); sent.innerHTML = ''; parts.forEach(p => sent.appendChild(p));
  const NOISE = ['what if?', 'why though?', 'another idea', 'research', 'wait.', 'does this work?', 'one more thing', 'figma', '3 am', 'not quite', 'try again', 'another tab', 'what about the user?', 'too many layers', 'coffee', 'focus', 'start over', 'okay, better', 'could be simpler', 'let me check', 'one last detail', 'almost', 'chaos'];
  const FACES = ['', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6'];
  const R = gsap.utils.random;
  const nz = NOISE.map(t => {
    const e = document.createElement('span'); e.textContent = t; e.className = 'l ' + FACES[(Math.random() * FACES.length) | 0];
    e.style.left = R(2, 80) + '%'; e.style.top = R(6, 88) + '%'; e.style.fontSize = R(14, 46) + 'px'; noise.appendChild(e);
    return { e, r: R(-25, 25), dx: R(-120, 120), dy: R(-80, 80) };
  });
  const sc = parts.map(() => ({ x: R(-.42, .42) * innerWidth, y: R(-.38, .38) * innerHeight, r: R(-40, 40), s: R(.35, .8) }));
  const ease = gsap.parseEase('power3.inOut');
  function frame(p) {
    const k = ease(gsap.utils.clamp(0, 1, (p - .08) / .62)), inv = 1 - k;
    parts.forEach((w, i) => { const o = sc[i]; w.style.transform = `translate(${o.x * inv}px,${o.y * inv}px) rotate(${o.r * inv}deg) scale(${o.s + (1 - o.s) * k})`; });
    const f = gsap.utils.clamp(0, 1, (p - .05) / .5);
    nz.forEach(n => { n.e.style.opacity = (1 - f).toFixed(3); n.e.style.transform = `translate(${n.dx * f}px,${n.dy * f}px) rotate(${n.r * (1 - f * .5)}deg)`; n.e.style.filter = `blur(${(f * 6).toFixed(1)}px)`; });
  }
  frame(0);
  ScrollTrigger.create({ trigger: '#vision', start: 'top top', end: '+=160%', pin: '#vision .pin', scrub: true, onUpdate: s => frame(s.progress) });
  gsap.utils.toArray('.beliefs li').forEach(li => gsap.from(li.children, { y: 60, opacity: 0, duration: 1.1, stagger: .08, ease: 'expo.out', clearProps: 'all', scrollTrigger: { trigger: li, start: 'top 82%' } }));
}
