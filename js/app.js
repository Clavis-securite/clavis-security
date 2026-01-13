// Clavis-security — app.js (v1)

// Mobile menu
const toggle = document.querySelector('[data-mobile-toggle]');
const menu = document.querySelector('[data-mobile-menu]');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

// Footer year
const y = document.querySelector('[data-year]');
if (y) y.textContent = String(new Date().getFullYear());

// Smooth anchors (optional)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (menu) menu.classList.remove('open');
  });
});
