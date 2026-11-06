// Marine snow: tiny particles drifting down while you're in the deep.
export function startSnow() {
  const cv = document.getElementById('snow'); if (!cv) return;
  const c = cv.getContext('2d');
  let w, h; const P = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + .3, v: Math.random() * .0006 + .0002 }));
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2); w = cv.width = cv.clientWidth * d; h = cv.height = cv.clientHeight * d; };
  size(); addEventListener('resize', size);
  (function loop() {
    requestAnimationFrame(loop); if (!document.body.classList.contains('deep')) return; c.clearRect(0, 0, w, h);
    P.forEach(p => { p.y += p.v; if (p.y > 1) p.y = 0; c.fillStyle = 'rgba(250,250,249,' + (.18 + p.r * .2) + ')'; c.beginPath(); c.arc(p.x * w, p.y * h, p.r * (devicePixelRatio || 1), 0, 7); c.fill(); });
  })();
}
