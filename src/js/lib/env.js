// Small shared helpers.
export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const $ = s => document.querySelector(s);
export const $$ = s => [...document.querySelectorAll(s)];

export const shuffle = a => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// the page's own colour also paints the area around it (overscroll, notch), so nothing flashes white
export function matchCanvas(el) {
  const c = getComputedStyle(el).backgroundColor;
  document.documentElement.style.backgroundColor = c;
  document.body.style.backgroundColor = c;
}

// where did we come from? only counts links inside this site
export function cameFrom() {
  try {
    const u = new URL(document.referrer);
    if (u.origin !== location.origin) return null;
    const file = u.pathname.split('/').pop() || 'index.html';
    return file.replace(/\.html$/, '') || 'index';
  } catch { return null; }
}
