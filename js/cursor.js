/* ============================================
   CURSOR.JS — True Click SEO
   Custom cursor + magnetic button effect
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  initCursor();
  initMagnetic();
});

/* ── Custom Cursor ───────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lag
  const animRing = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animRing);
  };
  requestAnimationFrame(animRing);

  // State: hovering interactive elements
  const interactiveSelectors = 'a, button, [role="button"], .btn, .project-card, .service-item, .case-card, input, textarea';
  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // State: hovering text links
  document.querySelectorAll('a').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
  });
}

/* ── Magnetic Button Effect ──────────────────── */
function initMagnetic() {
  const magnets = document.querySelectorAll('.magnetic');

  magnets.forEach(magnet => {
    const inner = magnet.querySelector('.btn, a, button') || magnet;
    const strength = parseFloat(magnet.dataset.strength) || 0.4;

    magnet.addEventListener('mousemove', e => {
      const rect = magnet.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      inner.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    magnet.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  });
}
