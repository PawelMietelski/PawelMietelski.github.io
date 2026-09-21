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
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const galleryTriggers = Array.from(document.querySelectorAll('.g-trigger'));
const pageLandmarks = [header, document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean);
let lastFocused = null;
let currentIndex = -1;

function showSlide(index) {
  currentIndex = (index + galleryTriggers.length) % galleryTriggers.length;
  const trigger = galleryTriggers[currentIndex];
  const img = trigger.querySelector('img');
  const caption = trigger.closest('.g-item').querySelector('figcaption');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightboxImg.style.maxWidth = '';
  lightboxImg.onload = () => {
    const cap = Math.min(lightboxImg.naturalWidth, Math.round(window.innerWidth * 0.9));
    lightboxImg.style.maxWidth = cap + 'px';
  };
}

function openLightbox(trigger) {
  lastFocused = trigger;
  showSlide(galleryTriggers.indexOf(trigger));

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
  const hasMultiple = galleryTriggers.length > 1;
  lightboxPrev.hidden = !hasMultiple;
  lightboxNext.hidden = !hasMultiple;

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showSlide(currentIndex - 1));
  lightboxNext.addEventListener('click', () => showSlide(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (hasMultiple && e.key === 'ArrowLeft') showSlide(currentIndex - 1);
    if (hasMultiple && e.key === 'ArrowRight') showSlide(currentIndex + 1);
  });
}

// Realizacje carousel
const carouselTrack = document.getElementById('carousel-track');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');

if (carouselTrack && carouselPrev && carouselNext) {
  const updateCarouselNav = () => {
    const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
    carouselPrev.disabled = carouselTrack.scrollLeft <= 1;
    carouselNext.disabled = carouselTrack.scrollLeft >= maxScroll - 1;
  };

  carouselPrev.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: -carouselTrack.clientWidth * 0.9, behavior: 'smooth' });
  });
  carouselNext.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: carouselTrack.clientWidth * 0.9, behavior: 'smooth' });
  });

  carouselTrack.addEventListener('scroll', updateCarouselNav, { passive: true });
  window.addEventListener('resize', updateCarouselNav);
  updateCarouselNav();
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
