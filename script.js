document.addEventListener('DOMContentLoaded', function () {
  // Morphing blobs with enhanced colors
  const blobShps = [
    [
      'M415.5,319.5Q446,389,381,443.5Q316,498,243,472.5Q170,447,104,383.5Q38,320,68,237Q98,154,184,114Q270,74,347,109Q424,144,409.5,222Q395,300,415.5,319.5Z',
      'M343,116Q410,178,392.5,261Q375,344,332,430Q289,516,205,476Q121,436,144,357.5Q167,279,158.5,212Q150,145,218.5,119.5Q287,94,343,116Z',
      'M380,320Q420,390,350,440Q280,490,210,450Q140,410,120,320Q100,230,170,180Q240,130,310,160Q380,190,380,320Z'
    ],
    [
      'M435,346.5Q379,443,271,460.5Q163,478,117.5,384Q72,290,150.5,217.5Q229,145,322.5,110Q416,75,453,186Q490,297,435,346.5Z',
      'M377,99Q476,168,453.5,284.5Q431,401,324.5,429.5Q218,458,133,396.5Q48,335,103.5,237.5Q159,140,263,106.5Q367,73,377,99Z',
      'M320,300Q360,360,300,420Q240,480,180,420Q120,360,140,300Q160,240,220,200Q280,160,320,220Q360,280,320,300Z'
    ]
  ];

  function animateBlob(svgId, pathArr, speed = 7400) {
    const path = document.querySelector(`#${svgId} path`);
    if (!path) return;
    
    let idx = 0, dir = 1;
    path.setAttribute('d', pathArr[0]);
    
    function morph() {
      idx = (idx + dir + pathArr.length) % pathArr.length;
      const duration = speed + 2000 * Math.random();
      
      path.animate(
        [{ d: path.getAttribute('d') }, { d: pathArr[idx] }],
        {
          duration: duration,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards'
        }
      );
      
      path.setAttribute('d', pathArr[idx]);
      if (idx === 0 || idx === pathArr.length - 1) dir *= -1;
      
      setTimeout(morph, duration);
    }
    
    morph();
  }

  animateBlob("blob1", blobShps[0], 7500);
  animateBlob("blob2", blobShps[1], 9200);

  // Enhanced animated color dots with mouse interaction
  const dotsContainer = document.querySelector('.hero-bg .dots');
  if (dotsContainer) {
    const dotCount = window.innerWidth < 700 ? 8 : 20;
    const dotColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const dots = [];
    
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      
      const size = 4 + 8 * Math.random();
      const posX = 95 * Math.random();
      const posY = 85 * Math.random() + 5;
      const color = dotColors[i % dotColors.length];
      
      dot.style.cssText = `
        top: ${posY}vh;
        left: ${posX}vw;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, ${color}, transparent 70%);
        opacity: ${0.3 + 0.4 * Math.random()};
        animation-delay: ${3 * Math.random()}s;
        box-shadow: 0 0 ${2 * size}px ${color}66;
      `;
      
      dotsContainer.appendChild(dot);
      dots.push({
        element: dot,
        baseX: posX,
        baseY: posY,
        offsetX: 0,
        offsetY: 0,
        speed: 0.5 + 1.5 * Math.random()
      });
    }
    
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth * 100;
      mouseY = e.clientY / window.innerHeight * 100;
    });
    
    function animateDots() {
      dots.forEach(dot => {
        const dx = mouseX - dot.baseX;
        const dy = mouseY - dot.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20) {
          dot.offsetX += 0.1 * dx * dot.speed;
          dot.offsetY += 0.1 * dy * dot.speed;
        }
        
        dot.offsetX *= 0.95;
        dot.offsetY *= 0.95;
        
        dot.element.style.transform = `
          translate(${dot.offsetX}px, ${dot.offsetY}px) 
          scale(${1 + 0.2 * Math.sin(0.001 * Date.now() + dot.baseX)})
        `;
      });
      
      requestAnimationFrame(animateDots);
    }
    
    animateDots();
  }

  // Hamburger nav with enhanced animation
  const navToggle = document.querySelector('.nav-toggle');
  const navUl = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul a');
  
  if (navToggle && navUl) {
    navToggle.addEventListener('click', function() {
      const isOpen = navUl.classList.contains('open');
      navUl.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', !isOpen);
      
      if (!isOpen) {
        navLinks.forEach((link, index) => {
          link.style.opacity = '0';
          link.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateX(0)';
          }, 50 * index);
        });
        navLinks[0]?.focus();
      }
    });
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 900) {
          navLinks.forEach((link, index) => {
            setTimeout(() => {
              link.style.opacity = '0';
              link.style.transform = 'translateX(-20px)';
            }, 30 * index);
          });
          
          setTimeout(() => {
            navUl.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
          }, 30 * navLinks.length + 100);
        }
      });
    });
  }

  // Smooth scroll with enhanced easing
  document.querySelectorAll('nav a[href^="#"], .to-top').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const targetOffset = target.offsetTop - 80;
        const startOffset = window.pageYOffset;
        const distance = targetOffset - startOffset;
        const duration = 800;
        let startTime = null;
        
        function scrollAnimation(currentTime) {
          if (!startTime) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // Enhanced easing function
          const ease = progress < 0.5 
            ? 4 * progress * progress * progress 
            : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
          
          window.scrollTo(0, startOffset + distance * ease);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(scrollAnimation);
          }
        }
        
        requestAnimationFrame(scrollAnimation);
      }
    });
  });

  // Section reveal with staggered animations
  const reveals = document.querySelectorAll('.reveal, .section');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Stagger animations for child elements
        entry.target.querySelectorAll('.project-card, .achievement-slot, .blog-post, li').forEach((el, index) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 100 * index);
        });
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  reveals.forEach(section => revealObserver.observe(section));

  // Nav active highlight on scroll
  const sections = [...document.querySelectorAll('section')];
  const navLinks = [...document.querySelectorAll('nav ul li a')];
  
  function updateActiveNav() {
    let scrollPos = window.scrollY + 120;
    let currentSection = sections[0];
    
    for (let section of sections) {
      if (scrollPos >= section.offsetTop) currentSection = section;
    }
    
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = navLinks.find(link => link.getAttribute('href').slice(1) === currentSection.id);
    
    if (activeLink) activeLink.classList.add('active');
  }
  
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNav, 10);
  });

  // Enhanced typewriter effect with blinking cursor
  const typewriter = document.getElementById('typewriter');
  if (typewriter) {
    const text = typewriter.textContent;
    let i = 0;
    typewriter.innerHTML = '<span class="cursor">|</span>';
    
    // Add blinking cursor styles
    const style = document.createElement('style');
    style.textContent = `
      .cursor {
        animation: blink 1s infinite;
        color: #667eea;
      }
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    function type() {
      if (i < text.length) {
        const char = text.charAt(i);
        typewriter.querySelector('.cursor').insertAdjacentText('beforebegin', char);
        i++;
        
        // Random typing speed (faster for spaces)
        const speed = char === ' ' ? 100 : 50 + 100 * Math.random();
        setTimeout(type, speed);
      } else {
        // Remove cursor after typing completes
        setTimeout(() => {
          const cursor = typewriter.querySelector('.cursor');
          if (cursor) cursor.remove();
        }, 1000);
      }
    }
    
    setTimeout(type, 500);
  }

  // Enhanced tilt effect for cards
  function addTiltEffect(selector, maxTilt = 12) {
    if (window.innerWidth > 700) {
      document.querySelectorAll(selector).forEach(card => {
        let isHovering = false;
        
        card.addEventListener('mouseenter', function() {
          isHovering = true;
          this.style.transition = 'transform 0.1s ease-out';
        });
        
        card.addEventListener('mousemove', function(e) {
          if (!isHovering) return;
          
          const rect = this.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
          const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
          
          this.style.transform = `
            perspective(1000px)
            rotateX(${-y * maxTilt}deg)
            rotateY(${x * maxTilt}deg)
            scale(1.05)
            translateZ(20px)
          `;
          
          this.style.boxShadow = `
            0 20px 40px rgba(102, 126, 234, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1)
          `;
        });
        
        card.addEventListener('mouseleave', function() {
          isHovering = false;
          this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          this.style.transform = '';
          this.style.boxShadow = '';
        });
      });
    }
  }
  
  addTiltEffect('.tilt-hover');

  // Enhanced scroll-to-top button with progress indicator
  const toTopBtn = document.querySelector('.to-top');
  if (toTopBtn) {
    // Create SVG progress circle
    const progressCircle = document.createElement('div');
    progressCircle.innerHTML = `
      <svg width="40" height="40" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
        <circle cx="20" cy="20" r="18" fill="none" stroke="#667eea" stroke-width="2" 
                stroke-dasharray="113" stroke-dashoffset="113" 
                style="transform: rotate(-90deg); transform-origin: center; transition: stroke-dashoffset 0.1s ease;"/>
      </svg>
    `;
    toTopBtn.appendChild(progressCircle);
    
    function updateToTopButton() {
      const scrollPosition = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = 113 - 113 * (scrollPosition / maxScroll);
      
      progressCircle.querySelector('circle:last-child').style.strokeDashoffset = progress;
      
      if (scrollPosition > 300) {
        toTopBtn.style.opacity = '1';
        toTopBtn.style.pointerEvents = 'auto';
        toTopBtn.style.transform = 'translateY(0) scale(1)';
      } else {
        toTopBtn.style.opacity = '0';
        toTopBtn.style.pointerEvents = 'none';
        toTopBtn.style.transform = 'translateY(20px) scale(0.8)';
      }
    }
    
    window.addEventListener('scroll', updateToTopButton);
    updateToTopButton();
  }

  // Enhanced certificate carousel
  const carousel = document.querySelector('.carousel-certificates');
  if (carousel) {
    const imgs = carousel.querySelectorAll('img');
    const prevBtn = document.querySelector('.carousel-cert-btn.prev');
    const nextBtn = document.querySelector('.carousel-cert-btn.next');
    const indicators = document.querySelector('.carousel-cert-indicators');
    let current = 0;
    const total = imgs.length;
    let autoPlayInterval;
    let isAutoPlay = true;
    let touchStartX = null;
    let touchStartY = null;
    let isTouching = false;
    
    // Create indicators
    indicators.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      if (i === 0) dot.classList.add('active');
      dot.tabIndex = 0;
      dot.setAttribute('aria-label', `Show certificate ${i + 1}`);
      dot.addEventListener('click', () => showCert(i));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') showCert(i);
      });
      indicators.appendChild(dot);
    }
    
    function updateCarousel() {
      imgs.forEach((img, index) => {
        const offset = 100 * (index - current);
        img.style.transform = `translateX(${offset}%) scale(${index === current ? 1 : 0.9})`;
        img.style.opacity = index === current ? '1' : '0.7';
        img.style.zIndex = index === current ? '2' : '1';
      });
      
      indicators.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === current);
      });
    }
    
    function showCert(index) {
      current = (index + total) % total;
      updateCarousel();
      resetAutoPlay();
    }
    
    function nextCert() {
      showCert(current + 1);
    }
    
    function prevCert() {
      showCert(current - 1);
    }
    
    function startAutoPlay() {
      if (isAutoPlay) {
        autoPlayInterval = setInterval(nextCert, 4000);
      }
    }
    
    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }
    
    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevCert);
    nextBtn.addEventListener('click', nextCert);
    
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevCert();
      if (e.key === 'ArrowRight') nextCert();
      if (e.key === ' ') {
        e.preventDefault();
        isAutoPlay = !isAutoPlay;
        if (isAutoPlay) startAutoPlay();
        else stopAutoPlay();
      }
    });
    
    // Touch support
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTouching = true;
      stopAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
      if (isTouching && touchStartX !== null) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const dx = touchStartX - touchX;
        const dy = touchStartY - touchY;
        
        // Only trigger swipe if horizontal movement is dominant
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          e.preventDefault();
          if (dx > 0) nextCert();
          else prevCert();
          isTouching = false;
          touchStartX = null;
        }
      }
    }, { passive: false });
    
    carousel.addEventListener('touchend', () => {
      isTouching = false;
      touchStartX = null;
      touchStartY = null;
      startAutoPlay();
    });
    
    // Initialize
    updateCarousel();
    startAutoPlay();
  }

  // Lazy load image fade-in effect
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '0';
      this.style.transform = 'scale(0.9)';
      this.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(() => {
        this.style.opacity = '1';
        this.style.transform = 'scale(1)';
      }, 100);
    });
  });

  // Clean up animations on page unload
  let animationFrameId;
  window.addEventListener('beforeunload', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  });
});
