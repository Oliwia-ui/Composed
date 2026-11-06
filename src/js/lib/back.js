// "← back" goes back to wherever you came from inside the site (same spot on the page),
// and to a sensible default when someone lands here straight from a link.
import { cameFrom } from './env.js';

export function backLink(a, labels) {
  const from = cameFrom();
  if (!from || !(from in labels)) return;
  a.textContent = labels[from];
  a.addEventListener('click', e => { e.preventDefault(); history.back(); });
}
