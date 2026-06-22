// ---------- Mobile nav toggle ----------
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Header elevation on scroll ----------
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---------- Scroll reveal (progressive enhancement) ----------
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // leave content fully visible for reduced-motion users

  const selector = [
    '.section-title', '.eyebrow', '.lead',
    '.service-card', '.split-media', '.split-text', '.feature-list',
    '.gallery figure', '.stats', '.testimonials blockquote',
    '.contact-form', '.contact-lead',
    '.included-card', '.process-step', '.cta-band .container > *'
  ].join(', ');

  // Don't animate hero content here — the hero has its own load animation.
  let pending = [...document.querySelectorAll(selector)].filter(el => !el.closest('.hero'));
  pending.forEach(el => el.classList.add('reveal'));

  // Stagger items inside known grids.
  document.querySelectorAll('.service-cards, .gallery, .included-grid, .process-steps')
    .forEach(grid => {
      [...grid.children].forEach((child, i) => {
        child.style.transitionDelay = (i % 6) * 0.08 + 's';
      });
    });

  // Rect-based reveal — robust across browsers (no IntersectionObserver dependency).
  const revealInView = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    pending = pending.filter(el => {
      const r = el.getBoundingClientRect();
      const inView = r.top < vh - 40 && r.bottom > 0;
      if (inView) el.classList.add('is-visible');
      return !inView;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { revealInView(); ticking = false; });
  };

  revealInView(); // reveal anything already in view on load
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', revealInView); // safety pass after images settle
})();
