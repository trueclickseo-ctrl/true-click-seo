/* ============================================
   TESTIMONIALS.JS — True Click SEO
   Auto-advancing testimonial slider
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTestimonials();
});

function initTestimonials() {
  const slider = document.querySelector('.testimonials-track');
  const dots   = document.querySelectorAll('.testimonials-dot');
  const cards  = document.querySelectorAll('.testimonial-slide');

  if (!slider || !cards.length) return;

  let current = 0;
  let timer;

  const goTo = (index) => {
    current = (index + cards.length) % cards.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => goTo(current + 1);

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startTimer();
    });
  });

  // Touch/swipe support
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      goTo(dx < 0 ? current + 1 : current - 1);
      startTimer();
    }
  });

  goTo(0);
  startTimer();
}
