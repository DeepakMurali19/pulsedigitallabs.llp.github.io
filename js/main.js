/* =========================================
   Pulse Digital Labs LLP – Main JavaScript
   ========================================= */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    toggleScrollTop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Hamburger / mobile nav ---- */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-nav-close');

  function openMenu() {
    mobileNav.classList.add('active');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('active');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---- Active nav link on scroll ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(function (a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  /* ---- Scroll-to-top button ---- */
  const scrollTopBtn = document.getElementById('scroll-top');

  function toggleScrollTop() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Contact form ---- */
  const form  = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Client-side validation */
    const nameEl    = form.querySelector('#name');
    const emailEl   = form.querySelector('#email');
    const messageEl = form.querySelector('#message');
    const errors    = [];

    if (!nameEl.value.trim()) {
      errors.push('Name is required.');
      nameEl.focus();
    } else if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      errors.push('A valid email address is required.');
      emailEl.focus();
    } else if (!messageEl.value.trim()) {
      errors.push('Message is required.');
      messageEl.focus();
    }

    if (errors.length > 0) {
      showToast('⚠️ ' + errors[0]);
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    /* Placeholder: replace setTimeout with a real fetch() call to your backend */
    setTimeout(function () {
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      showToast('✅ Message sent! We\'ll be in touch soon.');
    }, 1200);
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 4000);
  }

  /* ---- Intersection Observer – fade-in cards ---- */
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll(
    '.service-card, .portfolio-card, .team-card, .testimonial-card, .why-card'
  ).forEach(function (el) {
    el.classList.add('animate-ready');
    observer.observe(el);
  });

  /* ---- Animated counters in hero stats ---- */
  function animateCounter(el, target, suffix) {
    const start    = 0;
    const duration = 1800;
    let startTime  = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + eased * (target - start)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(function (el) {
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, suffix);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ---- Year in footer ---- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
