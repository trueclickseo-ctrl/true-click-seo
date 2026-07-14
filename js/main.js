/* ============================================
   MAIN.JS — True Click SEO
   Entry point: nav, scroll progress, page transition, init
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollProgress();
  initPageTransition();
  highlightActiveNav();
});

/* ── Navigation ──────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (!nav) return;

  // Scroll: transparent → solid
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── Active Nav Link ─────────────────────────── */
function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Scroll Progress ─────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrollTop / docHeight) * 100}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
}

/* ── Page Transition ─────────────────────────── */
function initPageTransition() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Page load: remove overlay (leave animation)
  overlay.classList.add('leaving');
  setTimeout(() => overlay.classList.remove('leaving'), 600);

  // Click on internal links: enter animation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('http') || href.startsWith('tel')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('entering');
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });
}
