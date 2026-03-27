/* ===========================
   YESVANTH K — PORTFOLIO JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR GLOW ──────────────────── */
  const glow = document.getElementById('cursor-glow');
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  /* ── SCROLL PROGRESS BAR ──────────── */
  const bar = document.getElementById('progress-bar');
  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.round((scrolled / total) * 100) + '%';
  }

  /* ── NAVBAR: shrink + active link ─── */
  const navEl = document.querySelector('nav');
  const navAnchors = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    // shrink
    if (window.scrollY > 60) navEl.classList.add('scrolled');
    else navEl.classList.remove('scrolled');

    // active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // back-to-top button
    const btn = document.getElementById('back-top');
    if (window.scrollY > 500) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }

  window.addEventListener('scroll', () => { updateProgress(); updateNav(); }, { passive: true });
  updateProgress();
  updateNav();

  /* ── HAMBURGER MENU ───────────────── */
  const burger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.getElementById('menu-overlay');

  function toggleMenu(open) {
    burger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    overlay.style.display = open ? 'block' : 'none';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', () => toggleMenu(!burger.classList.contains('open')));
  overlay.addEventListener('click', () => toggleMenu(false));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
  });

  /* ── SCROLL REVEAL ────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => revealObserver.observe(el));

  /* ── SKILL BARS: animate on entry ─── */
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.skill-fill');
        const target = fill.dataset.width;
        setTimeout(() => { fill.style.width = target; }, i * 60);
        skillObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  skillCards.forEach((c, i) => {
    const fill = c.querySelector('.skill-fill');
    fill.dataset.width = fill.style.width;
    fill.style.width = '0%';
    skillObserver.observe(c);
  });

  /* ── STAT COUNTER ANIMATION ───────── */
  function animateCount(el, target, duration = 1400) {
    const isDecimal = target % 1 !== 0;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = isDecimal ? (ease * target).toFixed(1) : Math.round(ease * target);
      el.textContent = val + el.dataset.suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const numEl = e.target.querySelector('.stat-num');
        const target = parseFloat(numEl.dataset.target);
        animateCount(numEl, target);
        statObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-card').forEach(c => statObserver.observe(c));

  /* ── TOAST NOTIFICATION ───────────── */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }

  /* ── COPY EMAIL ON CLICK ──────────── */
  const emailLink = document.getElementById('email-link');
  if (emailLink) {
    emailLink.addEventListener('click', e => {
      e.preventDefault();
      navigator.clipboard.writeText('yesvanthk471@gmail.com')
        .then(() => showToast('✓ Email copied to clipboard'))
        .catch(() => { window.location.href = 'mailto:yesvanthk471@gmail.com'; });
    });
  }

  /* ── TYPED TEXT EFFECT (hero) ─────── */
  const typeEl = document.getElementById('typed-role');
  if (typeEl) {
    const roles = ['AI Engineer', 'Full-Stack Dev', 'ML Enthusiast', 'Data Scientist'];
    let ri = 0, ci = 0, deleting = false;
    function type() {
      const word = roles[ri];
      if (deleting) {
        typeEl.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 500); return; }
        setTimeout(type, 60);
      } else {
        typeEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 90);
      }
    }
    setTimeout(type, 800);
  }

  /* ── STAGGERED CARD ENTRANCE ──────── */
  function staggerObserve(selector, delay = 80) {
    const cards = document.querySelectorAll(selector);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = [...cards].indexOf(e.target);
          e.target.style.transitionDelay = (idx * delay) + 'ms';
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(20px)';
      c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      obs.observe(c);
    });
  }
  staggerObserve('.skill-card', 55);
  staggerObserve('.cert-card', 80);
  staggerObserve('.activity-card', 90);
  staggerObserve('.project-card', 100);

  /* ── SMOOTH ANCHOR SCROLL ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 75;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── BACK TO TOP ──────────────────── */
  document.getElementById('back-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── DOWNLOAD RESUME (placeholder) ── */
  document.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast('📄 Resume download started');
      // Replace with actual PDF link when available
    });
  });

  /* ── ACTIVE SECTION INDICATOR ─────── */
  const sectionNames = {
    'about': '01 — about',
    'skills': '02 — skills',
    'experience': '03 — experience',
    'projects': '04 — projects',
    'certs': '05 — certs',
    'contact': '06 — contact'
  };

  /* ── PAGE LOAD ENTRANCE ───────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

});
