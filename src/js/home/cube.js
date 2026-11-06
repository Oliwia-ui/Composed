// The background cube: the site's navigation.
// Spin it by dragging anywhere, click a side and it zooms in until that side fills the screen,
// then its page loads. Coming back, the cube zooms out of the side you left from.
import { gsap } from '../lib/motion.js';
import { RM } from '../lib/env.js';

const PAGES = { about: 'about.html', work: 'work.html', process: 'process.html', play: 'playground.html', hello: 'contact.html' };
const ANG = { home: [0, 0], about: [0, -90], work: [0, -180], process: [0, 90], play: [-90, 0], hello: [90, 0] };
const NORM = { home: [0, 0, 1], about: [1, 0, 0], work: [0, 0, -1], process: [-1, 0, 0], play: [0, -1, 0], hello: [0, 1, 0] };
const FROM_KEY = 'composed:from';
// drag anywhere that isn't something else you can use
const NOPE = 'a,button:not(.bface),input,textarea,.hdr';

export function makeCube({ live, getLenis }) {
  const wrap = document.getElementById('bg3d'), bc = document.getElementById('bcube'), faceLbl = document.getElementById('bface');
  const visEl = document.getElementById('vision');
  const FACES = [...bc.querySelectorAll('.bface')];
  const st = { rx: -16, ry: 28, vx: 0, vy: 0, x: 0, y: 0, s: 1 };
  let mode = 'rest', front = 'home';
  const restPos = () => innerWidth <= 720 ? [innerWidth * .5, innerHeight * .55] : [innerWidth * .7, innerHeight * .55];
  [st.x, st.y] = restPos();
  addEventListener('resize', () => { if (mode === 'rest') [st.x, st.y] = restPos(); });
  const scrollRot = () => live ? scrollY * .045 : 0;
  const rad = d => d * Math.PI / 180;
  const cover = () => Math.max(innerWidth, innerHeight) / bc.offsetWidth * 1.9;

  function frontOf(rx, ry) {
    const a = rad(rx), b = rad(ry); let best = null, bz = -9;
    for (const k in NORM) { const [x, y, z] = NORM[k]; const z1 = -x * Math.sin(b) + z * Math.cos(b); const z2 = y * Math.sin(a) + z1 * Math.cos(a); if (z2 > bz) { bz = z2; best = k; } }
    return best;
  }

  /* ---------- dragging ---------- */
  let down = null, moved = 0, lt = 0;
  addEventListener('pointerdown', e => {
    if (mode !== 'rest' || e.button > 0) return;
    const t = e.target; if (t.closest && t.closest(NOPE)) return;
    down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, face: document.elementsFromPoint(e.clientX, e.clientY).map(el => el.closest && el.closest('.bface')).find(Boolean) };
    moved = 0; lt = e.timeStamp; st.vx = st.vy = 0;
  });
  addEventListener('pointermove', e => {
    if (!down) return; const dx = e.clientX - down.lx, dy = e.clientY - down.ly, dt = Math.max(8, e.timeStamp - lt);
    moved = Math.max(moved, Math.hypot(e.clientX - down.x, e.clientY - down.y));
    // on a phone only sideways swipes turn the cube (unless you grab the cube itself); up and down stays page scrolling
    const tch = e.pointerType === 'touch' && !down.face, k = e.pointerType === 'touch' ? .42 : .32;
    if (moved > 5) { document.documentElement.classList.add('spin'); st.ry += dx * k; st.vx = dx * k / dt * 16; if (!tch) { st.rx -= dy * k; st.vy = -dy * k / dt * 16; } }
    down.lx = e.clientX; down.ly = e.clientY; lt = e.timeStamp;
  });
  const up = () => { if (!down) return; const f = down.face; down = null; document.documentElement.classList.remove('spin'); if (moved <= 5 && f) go(f.dataset.p); };
  // the browser cancels the pointer when a swipe turns into a page scroll: stop turning, never open a side
  const cancel = () => { down = null; document.documentElement.classList.remove('spin'); };
  addEventListener('pointerup', up); addEventListener('pointercancel', cancel);
  FACES.forEach(f => f.addEventListener('click', e => { if (e.detail === 0) go(f.dataset.p); })); // keyboard

  /* ---------- the lens: each side carries an inverted copy of itself, clipped to a circle under the pointer ---------- */
  FACES.forEach(f => { const o = document.createElement('span'); o.className = 'inv'; o.setAttribute('aria-hidden', 'true'); o.innerHTML = f.innerHTML; f.appendChild(o); f._inv = o; f._r = 0; f._tx = 0; f._ty = 0; });
  let cmx = -1e5, cmy = -1e5, ctype = 'mouse';
  addEventListener('pointermove', e => { cmx = e.clientX; cmy = e.clientY; ctype = e.pointerType; }, { passive: true });
  document.addEventListener('pointerleave', () => { cmx = cmy = -1e5; });
  const rX = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; };
  const rY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
  const FROT = [p => p, p => rY(p, rad(90)), p => rY(p, rad(180)), p => rY(p, rad(-90)), p => rX(p, rad(90)), p => rX(p, rad(-90))];
  const det = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  // which side is under the pointer, and where on it: a ray from the eye solved against each face
  function hitTest(rx, ry) {
    const h = bc.offsetWidth / 2, D = 1800, sx = cmx - st.x, sy = cmy - st.y, A = rad(rx), B = rad(ry);
    const W = (i, u, v) => { const p = rX(rY(FROT[i]([u, v, h]), B), A); return [p[0] * st.s, p[1] * st.s, p[2] * st.s]; };
    let best = null;
    for (let i = 0; i < 6; i++) {
      const c = W(i, 0, 0), x1 = W(i, 1, 0), y1 = W(i, 0, 1);
      const eu = [x1[0] - c[0], x1[1] - c[1], x1[2] - c[2]], ev = [y1[0] - c[0], y1[1] - c[1], y1[2] - c[2]];
      const n = [eu[1] * ev[2] - eu[2] * ev[1], eu[2] * ev[0] - eu[0] * ev[2], eu[0] * ev[1] - eu[1] * ev[0]];
      if (n[0] * (0 - c[0]) + n[1] * (0 - c[1]) + n[2] * (D - c[2]) <= 0) continue; // facing away
      const dir = [sx, sy, -D], rhs = [-c[0], -c[1], D - c[2]];
      const m = [[eu[0], ev[0], -dir[0]], [eu[1], ev[1], -dir[1]], [eu[2], ev[2], -dir[2]]];
      const d0 = det(m); if (Math.abs(d0) < 1e-9) continue;
      const col = k => m.map((row, r) => row.map((v, j) => j === k ? rhs[r] : v));
      const u = det(col(0)) / d0, v = det(col(1)) / d0, t = det(col(2)) / d0;
      if (Math.abs(u) <= h && Math.abs(v) <= h && t > 0 && (!best || t < best.t)) best = { i, u: u + h, v: v + h, t };
    }
    return best;
  }

  /* ---------- opening a side ---------- */
  function target(k, folded) {
    const [ax, ay] = ANG[k], so = folded ? 0 : scrollRot();
    const ry = ay - so + Math.round((st.ry - (ay - so)) / 360) * 360, rx = ax + Math.round((st.rx - ax) / 360) * 360;
    return { rx, ry };
  }
  function spinTo(k) { const t = target(k); st.vx = st.vy = 0; gsap.to(st, { rx: t.rx, ry: t.ry, duration: 1, ease: 'power3.inOut' }); }

  function go(k) {
    if (mode !== 'rest') return;
    if (k === 'home') { const l = getLenis(); l ? l.scrollTo(0, { duration: 1.8 }) : scrollTo({ top: 0, behavior: 'smooth' }); spinTo(k); return; }
    sessionStorage.setItem(FROM_KEY, k);
    if (RM) { location.href = PAGES[k]; return; }
    st.ry += scrollRot(); mode = 'zoom'; st.vx = st.vy = 0; getLenis() && getLenis().stop();
    const t = target(k, true);
    gsap.timeline({ onComplete: () => { location.href = PAGES[k]; } })
      .to(st, { rx: t.rx, ry: t.ry, duration: .8, ease: 'power3.inOut' })
      .to(st, { x: innerWidth / 2, y: innerHeight / 2, duration: .8, ease: 'power3.inOut' }, 0)
      .to(st, { s: cover(), duration: .75, ease: 'expo.in' });
  }

  // back on the home page: start inside the side you left from and zoom back out to the cube
  function returnFrom(k) {
    if (!ANG[k] || RM) { mode = 'rest'; st.s = 1; [st.x, st.y] = restPos(); return; }
    const t = target(k, true);
    Object.assign(st, { rx: t.rx, ry: t.ry, x: innerWidth / 2, y: innerHeight / 2, s: cover(), vx: 0, vy: 0 });
    mode = 'zoom';
    const [x0, y0] = restPos();
    gsap.timeline({ onComplete: () => { st.ry -= scrollRot(); mode = 'rest'; getLenis() && getLenis().start(); } })
      .to(st, { s: 1, duration: .9, ease: 'expo.out' }, .05)
      .to(st, { x: x0, y: y0, duration: 1, ease: 'power3.inOut' }, .15)
      .to(st, { rx: st.rx - 16, ry: st.ry + 28, duration: 1.1, ease: 'power3.out' }, .2);
  }
  const back = sessionStorage.getItem(FROM_KEY);
  if (back) { sessionStorage.removeItem(FROM_KEY); returnFrom(back); }
  // the browser's back button can restore this page exactly as we left it: zoomed into a side
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    const k = sessionStorage.getItem(FROM_KEY); sessionStorage.removeItem(FROM_KEY);
    returnFrom(k || front);
  });

  /* ---------- every frame ---------- */
  let hov = null;
  (function loop() {
    requestAnimationFrame(loop);
    if (mode === 'rest' && !down) {
      st.ry += st.vx; st.rx += st.vy; st.vx *= .95; st.vy *= .95;
      if (Math.abs(st.vx) < .02 && live && !RM) st.ry += .04; // idle drift
    }
    // the cube steps aside while the big sentence composes
    const vr = visEl.getBoundingClientRect();
    const away = mode === 'rest' && vr.top < innerHeight * .5 && vr.bottom > innerHeight * .5;
    wrap.classList.toggle('away', away);
    const rx = st.rx, ry = st.ry + (mode === 'rest' ? scrollRot() : 0);
    wrap.style.left = st.x + 'px'; wrap.style.top = st.y + 'px';
    bc.style.transform = `scale(${st.s}) rotateX(${rx}deg) rotateY(${ry}deg)`;
    const f = frontOf(rx, ry); if (f !== front) { front = f; faceLbl.textContent = f; }
    const blocked = (() => { const el = document.elementFromPoint(cmx, cmy); return el && el.closest && el.closest(NOPE); })();
    const hit = mode === 'rest' && !away && ctype !== 'touch' && !blocked && cmx > -1e4 ? hitTest(rx, ry) : null;
    const hf = hit ? FACES[hit.i] : null;
    if (hf !== hov) { hov = hf; document.documentElement.classList.toggle('overface', !!hov); }
    const R = bc.offsetWidth * .16;
    FACES.forEach(F => {
      const on = F === hf; if (on) { F._tx = hit.u; F._ty = hit.v; } F._r += ((on ? R : 0) - F._r) * .22;
      F._inv.style.clipPath = F._r < .5 ? 'circle(0px at 50% 50%)' : `circle(${F._r.toFixed(1)}px at ${F._tx.toFixed(1)}px ${F._ty.toFixed(1)}px)`;
    });
  })();
}
