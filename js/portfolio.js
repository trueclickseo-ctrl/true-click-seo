/* ============================================
   PORTFOLIO.JS — True Click SEO
   Filterable portfolio grid
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
});

function initPortfolioFilter() {
  const filters = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.portfolio-item');

  if (!filters.length || !items.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;

      items.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        if (match) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          item.style.display = '';
          // Tiny defer so browser paints display before animating
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          });
        } else {
          item.style.opacity    = '0';
          item.style.transform  = 'scale(0.95)';
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}
