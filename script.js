/* ============================================
   VELTRO MEDIA — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');

  if (window.innerWidth > 768) {
    cursor.style.opacity = '0';

    document.addEventListener('mousemove', e => {
      cursor.style.opacity = '1';
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const hoverTargets = document.querySelectorAll('a, button, .service-card, .work-thumb, .filter-btn, .why-card, .testimonial-card, .stat-card, .logo-slot');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ==========================================
  // NAV SCROLL EFFECT
  // ==========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ==========================================
  // MOBILE HAMBURGER
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ==========================================
  // HERO REVEAL on Load
  // ==========================================
  const triggerHero = () => {
    document.querySelectorAll('#hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  };
  window.addEventListener('load', () => setTimeout(triggerHero, 150));

  // ==========================================
  // INTERSECTION OBSERVER — Scroll Animations
  // ==========================================
  const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in, .stagger').forEach(el => observer.observe(el));

  document.querySelectorAll('.section-title:not(#hero *), .section-label:not(#hero *), .section-sub').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
  });
  document.querySelectorAll('.about-left, .about-stats, .contact-left, .contact-right').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
  });
  ['services-grid', 'work-grid', 'why-grid', 'testimonials-grid'].forEach(cls => {
    const el = document.querySelector('.' + cls);
    if (el) { el.classList.add('stagger'); observer.observe(el); }
  });

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1600;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => counterObserver.observe(el));

  // ==========================================
  // WORK FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      workItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          item.offsetHeight;
          item.style.animation = 'fadeInScale 0.35s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(styleSheet);

  // ==========================================
  // SMOOTH ACTIVE NAV LINK
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active-nav'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active-nav');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => navObserver.observe(s));

  const navStyle = document.createElement('style');
  navStyle.textContent = `.nav-links a.active-nav { color: var(--text) !important; }`;
  document.head.appendChild(navStyle);

});