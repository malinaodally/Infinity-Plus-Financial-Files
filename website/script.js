(() => {
  'use strict';

  /* ---------------------------------------------------
     Back to top button (declared early: referenced by
     onScroll below, which fires immediately on load)
  --------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------
     Sticky header: shadow + tighter padding on scroll
  --------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------
     Mobile hamburger menu
  --------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  const closeMenu = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.classList.toggle('open', !isOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------------------------------------------------
     Smooth scroll offset for fixed header
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 90;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------
     Scroll-reveal (fade up) via IntersectionObserver
  --------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------
     Contact form validation + submit handling
  --------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your full name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
    phone: (v) => v.replace(/\D/g, '').length >= 7 || 'Please enter a valid phone number.',
    service: (v) => v.length > 0 || 'Please select a service.'
  };

  const validateField = (field) => {
    const errorEl = document.getElementById('err-' + field.name);
    const validator = validators[field.name];
    if (!validator) return true;
    const result = validator(field.value);
    if (result === true) {
      field.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
    field.classList.add('invalid');
    if (errorEl) errorEl.textContent = result;
    return false;
  };

  if (form) {
    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      if (field) field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      Object.keys(validators).forEach((name) => {
        const field = form.elements[name];
        if (field && !validateField(field)) valid = false;
      });

      if (!valid) {
        statusEl.textContent = 'Please correct the highlighted fields.';
        statusEl.classList.remove('success');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      /* NOTE: this currently simulates a submission locally.
         Connect this to your email service or backend endpoint
         (e.g. Formspree, Netlify Forms, or your own API) to
         actually receive submissions. */
      setTimeout(() => {
        statusEl.textContent = "Thank you. We've received your request and will reach out soon.";
        statusEl.classList.add('success');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 900);
    });
  }

  /* ---------------------------------------------------
     Footer year
  --------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
