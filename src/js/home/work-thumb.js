// The work list: a preview follows the cursor while you hover a project.
export function workThumb() {
  const thumb = document.getElementById('wthumb'); if (!thumb) return;
  let tx = 0, ty = 0, cx = 0, cy = 0, live = false;
  document.querySelectorAll('.wlist a').forEach(a => {
    a.addEventListener('click', () => thumb.classList.remove('on'));
    a.addEventListener('pointerenter', () => {
      thumb.className = 'wthumb vis ' + (a.dataset.thumb ? '' : 'v-' + a.dataset.vis) + ' on';
      thumb.style.setProperty('background-color', a.dataset.bg, 'important');
      thumb.style.backgroundImage = a.dataset.thumb ? `url(${a.dataset.thumb})` : '';
    });
    a.addEventListener('pointerleave', () => thumb.classList.remove('on'));
  });
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; if (!live) { cx = tx; cy = ty; live = true; } }, { passive: true });
  (function loop() { requestAnimationFrame(loop); cx += (tx - cx) * .14; cy += (ty - cy) * .14; thumb.style.left = cx + 'px'; thumb.style.top = cy + 'px'; })();
}
