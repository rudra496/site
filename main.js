document.addEventListener('DOMContentLoaded', () => {
  // --- 1) Mobile Navigation Toggle & Click-Only Tree Dropdowns ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const dropdownParents = document.querySelectorAll('.nav-item.has-dropdown');

  const closeAllDropdowns = () => {
    dropdownParents.forEach(item => {
      item.classList.remove('open');
      const trigger = item.querySelector('.nav-link');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  if (menuToggle && navLinks) {
    const icon = menuToggle.querySelector('i');

    const openMenu = () => {
      navLinks.classList.add('active');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-xmark');
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
      closeAllDropdowns();
    };

    menuToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) closeMenu();
      else openMenu();
    });

    // --- Click-Only Dropdown Toggle (Both Desktop and Mobile) ---
    dropdownParents.forEach(parent => {
      const trigger = parent.querySelector('.nav-link');
      if (!trigger) return;

      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const wasOpen = parent.classList.contains('open');

        // Close all other dropdowns
        closeAllDropdowns();

        // If it was closed, open it
        if (!wasOpen) {
          parent.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Close all dropdowns when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item.has-dropdown')) {
        closeAllDropdowns();
      }
    });

    // Clicking top-level direct links without dropdown closes mobile menu & all dropdowns
    const directLinks = document.querySelectorAll('.nav-item:not(.has-dropdown) .nav-link, .dropdown-link');
    directLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        closeMenu();
      }
    });

    // Close if resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) {
        if (navLinks.classList.contains('active')) closeMenu();
      }
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
  const startTheme = saved || 'light';
  root.setAttribute('data-theme', startTheme);

  // Inject a theme toggle into the nav
  const navContainer = document.querySelector('.nav-container');
  if (navContainer) {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.title = 'Toggle theme';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.innerHTML = startTheme === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
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

  // --- 6) Slow Typing & Dynamic Interaction for "Rudra Sarker" ---
  const typingName = document.getElementById('hero-typing-name');
  if (typingName) {
    const textSpan = typingName.querySelector('.typed-text');
    const cursor = typingName.querySelector('.typing-cursor');
    const fullName = "Rudra Sarker";
    let isTyping = false;

    const runTypewriter = (speed = 120) => {
      if (isTyping) return;
      isTyping = true;
      if (textSpan) textSpan.textContent = '';
      if (cursor) {
        cursor.style.opacity = '1';
        cursor.style.display = 'inline-block';
      }
      let i = 0;
      const typeChar = () => {
        if (i < fullName.length) {
          textSpan.textContent += fullName.charAt(i);
          i++;
          setTimeout(typeChar, speed);
        } else {
          isTyping = false;
          // Keep cursor blinking gently for 4s, then fade to subtle accent
          if (cursor) {
            setTimeout(() => {
              if (!isTyping) cursor.style.opacity = '0.35';
            }, 4000);
          }
        }
      };
      typeChar();
    };

    // Trigger typing smoothly 280ms after DOM is ready
    setTimeout(() => runTypewriter(120), 280);

    // Re-type on click for interactive delight
    typingName.addEventListener('click', () => {
      runTypewriter(85);
    });
  }

  // --- 7) Dynamic Blog Count Synchronizer ---
  const applyBlogCount = (count) => {
    if (!count) return;
    document.querySelectorAll('.dynamic-blog-count').forEach(el => {
      el.textContent = count;
    });
    document.querySelectorAll('[data-blog-count="num"]').forEach(el => {
      el.textContent = count;
    });
  };

  const isSubdir = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/projects/');
  const manifestUrl = isSubdir ? '../blog/blog-manifest.json' : './blog/blog-manifest.json';

  fetch(manifestUrl)
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      if (data && typeof data.count === 'number') {
        applyBlogCount(data.count);
      }
    })
    .catch(() => {
      // Graceful offline / static fallback
    });
});