/* ============================================
   KEITH VILLANUEVA — PORTFOLIO
   script.js
   ============================================ */

(function () {
  'use strict';

  // ── Nav: scroll behavior ──────────────────
  const nav = document.getElementById('nav');

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  // ── Nav: mobile toggle ────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
    // Prevent body scroll while menu is open
    document.body.style.overflow = nav.classList.contains('nav--open') ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      nav.classList.remove('nav--open');
      document.body.style.overflow = '';
    }
  });


  // ── Scroll animations (IntersectionObserver) ──
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -48px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });


  // ── Smooth active-link highlighting ──────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle(
            'nav__link--active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => sectionObserver.observe(sec));


  // ── Slide navigation dots ─────────────────
  const slideScroll = document.querySelector('.ai-exp__scroll-wrap');
  const slideTrack  = document.querySelector('.ai-exp__track');
  const slideDots   = document.querySelectorAll('.ai-exp__dot');

  if (slideScroll && slideTrack && slideDots.length) {
    function getSlides() {
      return Array.from(slideTrack.querySelectorAll('.ai-slide'));
    }

    function setActiveSlide(i) {
      const slides = getSlides();
      slides.forEach((s, j) => s.classList.toggle('ai-slide--active', j === i));
      slideDots.forEach((d, j) => d.classList.toggle('ai-exp__dot--active', j === i));
    }

    // Scroll slide i so its left edge aligns with the container's left edge
    // (same x-position as "Designing for AI Agents" heading above)
    function scrollToSlide(i) {
      const slides = getSlides();
      if (!slides[i]) return;
      const origin = slides[0].offsetLeft; // = container left offset
      slideScroll.scrollTo({ left: slides[i].offsetLeft - origin, behavior: 'smooth' });
      setActiveSlide(i);
    }

    function updateActiveDot() {
      const slides = getSlides();
      const origin = slides[0] ? slides[0].offsetLeft : 0;
      const visibleLeft = slideScroll.scrollLeft + origin;
      let active = 0;
      slides.forEach((slide, i) => {
        // A slide is "active" once its left edge has reached the section's
        // left alignment line (i.e., it is fully scrolled into position).
        if (slide.offsetLeft <= visibleLeft + 8) active = i;
      });
      setActiveSlide(active);
    }

    // Dot clicks
    slideDots.forEach(dot => {
      dot.addEventListener('click', () => scrollToSlide(parseInt(dot.dataset.slide, 10)));
    });

    // Slide clicks
    getSlides().forEach((slide, i) => {
      slide.addEventListener('click', () => scrollToSlide(i));
    });

    slideScroll.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();
  }

})();
