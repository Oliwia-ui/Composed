// Splitting type into letters and words so each piece can move on its own.

export const state = { cls: '' }; // the look new letters are born with (changes over time, see typeplay)

// every changing letter sits on top of an invisible copy of itself in the base font,
// so the layout is fixed by the copy and the visible letter can change freely without moving anything
export function slot(c, cls) {
  const w = document.createElement('span'); w.className = 'slt';
  const g = document.createElement('span'); g.className = 'gh'; g.setAttribute('aria-hidden', 'true'); g.textContent = c;
  const s = document.createElement('span'); s.className = 'l' + (cls ? ' ' + cls : ''); s.textContent = c;
  w.append(g, s);
  return [w, s];
}

export function letters(el, txt = el.textContent) {
  if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', txt.trim());
  el.innerHTML = '';
  return [...txt].map(c => {
    const [w, s] = slot(c === ' ' ? ' ' : c, state.cls && c !== ' ' ? state.cls : '');
    w.setAttribute('aria-hidden', 'true');
    el.appendChild(w);
    return s;
  });
}

export function words(el, txt) {
  el.innerHTML = '';
  return txt.split(' ').map(w => {
    const s = document.createElement('span'); s.className = 'wd'; s.textContent = w;
    el.appendChild(s); el.appendChild(document.createTextNode(' '));
    return s;
  });
}

function splitText(el, mk) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('.l,.gw,.slt') ? 2 : (n.nodeValue.trim() ? 1 : 2) });
  const nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
  nodes.forEach(n => { const f = document.createDocumentFragment(); mk(n.nodeValue, f); n.replaceWith(f); });
}

export function typeify(el) {
  if (!el.hasAttribute('aria-label') && !el.closest('[aria-hidden="true"]')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  splitText(el, (t, f) => [...t].forEach(c => { if (c === ' ' || c === '\n') { f.append(c); return; } const [w] = slot(c, state.cls); f.append(w); }));
}

export function wordify(el) {
  splitText(el, (t, f) => t.split(/(\s+)/).forEach(w => {
    if (!w.trim()) { f.append(w); return; }
    const s = document.createElement('span'); s.className = 'gw'; s.textContent = w; f.append(s);
  }));
}
