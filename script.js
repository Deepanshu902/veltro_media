/* ============================================
   VELTRO MEDIA — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    (function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    })();

    const hoverTargets = document.querySelectorAll('a, button, .service-card, .work-thumb, .filter-btn');
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
    navbar.classList.toggle('scrolled', window.scrollY > 60);
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
  // HERO CANVAS — ANIMATED GRID LINES
  // ==========================================
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const PARTICLE_COUNT = 60;
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  const CONNECT_DIST = 120;
  const ACCENT_COLOR = '79, 142, 247';

  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid
    ctx.strokeStyle = 'rgba(245, 245, 245, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Update & draw particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT_COLOR}, ${p.alpha})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw a diagonal accent line
    const time = Date.now() * 0.0003;
    const grad = ctx.createLinearGradient(0, canvas.height * 0.3, canvas.width * 0.6, canvas.height);
    grad.addColorStop(0, `rgba(${ACCENT_COLOR}, 0)`);
    grad.addColorStop(0.5, `rgba(${ACCENT_COLOR}, 0.06)`);
    grad.addColorStop(1, `rgba(${ACCENT_COLOR}, 0)`);
    ctx.beginPath();
    ctx.moveTo(-200, canvas.height * (0.5 + Math.sin(time) * 0.1));
    ctx.lineTo(canvas.width * 0.5, canvas.height * (0.3 + Math.sin(time * 0.7) * 0.1));
    ctx.lineTo(canvas.width + 200, canvas.height * (0.6 + Math.sin(time * 1.3) * 0.1));
    ctx.strokeStyle = grad;
    ctx.lineWidth = 60;
    ctx.stroke();

    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();

  // ==========================================
  // HERO REVEAL on Load
  // ==========================================
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

  // ==========================================
  // INTERSECTION OBSERVER — Scroll Animations
  // ==========================================
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in, .stagger').forEach(el => observer.observe(el));

  // Add animate-in class to section elements
  document.querySelectorAll('.section-title:not(#hero *), .section-label:not(#hero *)').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
  });
  document.querySelectorAll('.about-left, .about-stats').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
  });
  ['services-grid', 'work-grid', 'why-grid', 'testimonials-grid', 'contact-grid'].forEach(cls => {
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
        const duration = 1800;
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
          item.offsetHeight; // reflow
          item.style.animation = 'fadeInScale 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Add keyframe for filter animation
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(styleSheet);

  // ==========================================
  // CONTACT FORM
  // ==========================================
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  submitBtn.addEventListener('click', () => {
    const name = document.getElementById('formName').value.trim();
    const company = document.getElementById('formCompany').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !company || !service || !message) {
      submitBtn.textContent = 'Please fill all fields';
      submitBtn.style.background = '#ef4444';
      setTimeout(() => {
        submitBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
        submitBtn.style.background = '';
      }, 2000);
      return;
    }

    // Simulate send (could wire to EmailJS, Formspree etc.)
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      formSuccess.classList.add('show');
      // Reset form
      document.getElementById('formName').value = '';
      document.getElementById('formCompany').value = '';
      document.getElementById('formService').value = '';
      document.getElementById('formMessage').value = '';
      setTimeout(() => {
        submitBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
        submitBtn.disabled = false;
        formSuccess.classList.remove('show');
      }, 4000);
    }, 1500);
  });

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
  }, { threshold: 0.4 });
  sections.forEach(s => navObserver.observe(s));

  // Add active nav style
  const navStyle = document.createElement('style');
  navStyle.textContent = `.nav-links a.active-nav { color: var(--white) !important; }`;
  document.head.appendChild(navStyle);

});
