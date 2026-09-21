// Mobile nav toggle
const header = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.getElementById('nav').addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      header.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Contact form — no backend wired up yet, just local confirmation.
// Replace this with a real submit (e.g. POST to your own endpoint or a
// form service) before going live.
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = 'Dziękujemy! Wiadomość zapisana lokalnie — podłącz formularz do prawdziwej wysyłki (patrz komentarz w js/main.js).';
    form.reset();
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const pageLandmarks = [header, document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean);
let lastFocused = null;

function openLightbox(trigger) {
  const img = trigger.querySelector('img');
  const caption = trigger.closest('.g-item').querySelector('figcaption');
  lastFocused = trigger;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightboxImg.style.maxWidth = '';
  lightboxImg.onload = () => {
    const cap = Math.min(lightboxImg.naturalWidth, Math.round(window.innerWidth * 0.9));
    lightboxImg.style.maxWidth = cap + 'px';
  };

  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  pageLandmarks.forEach((el) => el.setAttribute('inert', ''));
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
  pageLandmarks.forEach((el) => el.removeAttribute('inert'));
  lightboxImg.src = '';
  if (lastFocused) lastFocused.focus();
}

if (lightbox) {
  document.querySelectorAll('.g-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

// Highlight the current section's nav link while scrolling
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a');

if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
  const linkFor = (id) => document.querySelector(`.nav a[href="#${id}"]`);
  const visible = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));

    const activeId = Array.from(sections).find((s) => visible.get(s.id))?.id;

    navLinks.forEach((l) => l.classList.remove('is-active'));
    if (activeId) linkFor(activeId)?.classList.add('is-active');
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((section) => observer.observe(section));
}
