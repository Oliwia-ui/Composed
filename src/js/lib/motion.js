// GSAP + ScrollTrigger + Lenis, set up once per page.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { RM } from './env.js';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

let lenis = null;
export const getLenis = () => lenis;

export function smoothScroll() {
  if (RM) return null;
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // in-page anchors glide instead of jumping
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) { e.preventDefault(); return; }
    const t = document.querySelector(id); if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.6 }); }
  }));
  return lenis;
}

// a link that came from a view transition already has its title in place: don't animate it in again
export function arrivedWithTransition() {
  const v = sessionStorage.getItem('composed:vt');
  sessionStorage.removeItem('composed:vt');
  return !!v && 'startViewTransition' in document && !RM;
}
export function markTransition(links) {
  links.forEach(a => a.addEventListener('click', () => sessionStorage.setItem('composed:vt', '1')));
}
