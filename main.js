document.addEventListener('DOMContentLoaded', () => {
  // --- 1) Mobile Navigation Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navLinks) {
    const icon = menuToggle.querySelector('i');

    const openMenu = () => {
      navLinks.classList.add('active');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.remove('fa-times'); // legacy FA5
        icon.classList.add('fa-xmark');    // FA v6
      }
      menuToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      navLinks.classList.remove('active');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) closeMenu();
      else openMenu();
    });

    // Close on nav link click (mobile)
    allNavLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close if resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // --- 2) Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- 3) Feedback Form Handling (Contact page only) ---
  const feedbackForm = document.getElementById('feedback-form');
  const feedbackThanks = document.getElementById('feedback-thanks');
  if (feedbackForm && feedbackThanks) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      feedbackForm.style.display = 'none';
      feedbackThanks.style.display = 'block';
      setTimeout(() => feedbackForm.reset(), 500);
    });
  }

  // --- 4) Theme Toggle (Auto/Light/Dark) ---
  const root = document.documentElement;
  const THEME_KEY = 'theme';
  const saved = localStorage.getItem(THEME_KEY);
  const systemPref = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const startTheme = saved || systemPref || 'dark';
  root.setAttribute('data-theme', startTheme);

  // Inject a theme toggle into the nav
  const navContainer = document.querySelector('.nav-container');
  if (navContainer) {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.title = 'Toggle theme';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    navContainer.appendChild(btn);

    const setTheme = (mode) => {
      root.setAttribute('data-theme', mode);
      localStorage.setItem(THEME_KEY, mode);
      btn.innerHTML = mode === 'light'
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    };
    setTheme(startTheme);

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // --- 5) JSON-LD (SEO) on homepage ---
  if (document.querySelector('canvas#bg-3d')) {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Rudra Sarker',
      url: 'https://rudra496.github.io/site/',
      sameAs: [
        'https://github.com/rudra496',
        'https://www.linkedin.com/in/rudra-sarker-573b15296',
        'https://www.facebook.com/rudrasarker130'
      ],
      jobTitle: 'Industrial Engineer, Robotics Enthusiast, Full-Stack Developer'
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }
});