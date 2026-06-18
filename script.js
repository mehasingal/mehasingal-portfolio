// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll with sticky-nav offset
const NAV_HEIGHT = 64;
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// 1. Hero content fade-out on scroll (section stays opaque so gradient blends seamlessly)
const hero = document.getElementById('hero');
const heroContent = hero.querySelector('.hero__content');
window.addEventListener('scroll', () => {
  const heroHeight = hero.offsetHeight;
  const progress = Math.min(1, window.scrollY / (heroHeight * 0.6));
  if (heroContent) heroContent.style.opacity = 1 - progress;
}, { passive: true });

// 2. Section fade-in on entry (all .section elements — hero has no .section class)
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.section').forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// Staggered fade-in for child elements within grid/list containers
['.skills__groups', '.education__list'].forEach(selector => {
  const parent = document.querySelector(selector);
  if (!parent) return;
  [...parent.children].forEach((child, i) => {
    child.classList.add('fade-in');
    child.style.transitionDelay = `${i * 100}ms`;
    fadeObserver.observe(child);
  });
});

// Showcase section entry animations (covers all .showcase sections)
document.querySelectorAll('.showcase').forEach(section => {
  new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) {
      section.classList.add('showcase--visible');
      obs.disconnect();
    }
  }, { threshold: 0.12 }).observe(section);
});

// TerraAntiqua iframe fallback
(function () {
  const iframe   = document.getElementById('terra-iframe');
  const fallback = document.getElementById('terra-fallback');
  if (!iframe || !fallback) return;

  iframe.addEventListener('load', function () {
    try {
      // Cross-origin content throws SecurityError → iframe loaded fine, keep it.
      // Same-origin blank document → assume blocked, show fallback.
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || doc.body.childElementCount === 0) {
        iframe.hidden = true;
        fallback.hidden = false;
      }
    } catch (e) {
      // SecurityError: cross-origin page loaded successfully — nothing to do.
    }
  });
}());

// Research photo carousel (Parsing the English Catalogue)
(function () {
  const carousel = document.getElementById('research-carousel');
  const dotsWrap = document.getElementById('research-dots');
  if (!carousel || !dotsWrap) return;

  const slides = carousel.querySelectorAll('.photo-carousel__slide');
  const dots   = dotsWrap.querySelectorAll('.photo-dot');
  const prev   = carousel.querySelector('.photo-carousel__btn--prev');
  const next   = carousel.querySelector('.photo-carousel__btn--next');

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('photo-carousel__slide--active');
    dots[current].classList.remove('photo-dot--active');
    dots[current].setAttribute('aria-selected', 'false');

    current = ((index % slides.length) + slides.length) % slides.length;

    slides[current].classList.add('photo-carousel__slide--active');
    dots[current].classList.add('photo-dot--active');
    dots[current].setAttribute('aria-selected', 'true');

    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  timer = setInterval(() => goTo(current + 1), 4000);
}());

// Snohomish photo carousel
(function () {
  const carousel = document.getElementById('snohomish-carousel');
  const dotsWrap = document.getElementById('snohomish-dots');
  if (!carousel || !dotsWrap) return;

  const slides = carousel.querySelectorAll('.photo-carousel__slide');
  const dots   = dotsWrap.querySelectorAll('.photo-dot');
  const prev   = carousel.querySelector('.photo-carousel__btn--prev');
  const next   = carousel.querySelector('.photo-carousel__btn--next');

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('photo-carousel__slide--active');
    dots[current].classList.remove('photo-dot--active');
    dots[current].setAttribute('aria-selected', 'false');

    current = ((index % slides.length) + slides.length) % slides.length;

    slides[current].classList.add('photo-carousel__slide--active');
    dots[current].classList.add('photo-dot--active');
    dots[current].setAttribute('aria-selected', 'true');

    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  timer = setInterval(() => goTo(current + 1), 4000);
}());

// MoodRoom video carousel
(function () {
  const VIDEOS = [
    'assets/videos/moodroom-1.mp4',
    'assets/videos/moodroom-2.mp4',
    'assets/videos/moodroom-3.mp4',
    'assets/videos/moodroom-4.mp4',
  ];

  const video = document.getElementById('showcase-video');
  const dots  = document.querySelectorAll('.carousel-dot');
  if (!video || !dots.length) return;

  let current = 0;

  function goTo(index) {
    current = index;
    video.src = VIDEOS[index];
    video.load();
    video.play().catch(() => {});
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('carousel-dot--active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  video.addEventListener('ended', () => goTo((current + 1) % VIDEOS.length));

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index, 10)));
  });

  goTo(0);
}());
