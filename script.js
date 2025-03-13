document.addEventListener('DOMContentLoaded', (event) => {
  const sections = document.querySelectorAll('.section');
  const navButtons = document.querySelectorAll('.toggle-btn');

  // Hide all sections initially
  sections.forEach(section => {
    section.style.display = 'none';
  });

  // Show home section by default
  document.getElementById('home').style.display = 'block';

  // Function to show a section
  function showSection(targetId) {
    sections.forEach(section => {
      if (section.id === targetId) {
        section.style.display = 'block';
        section.classList.remove('hidden');
        section.querySelectorAll('.animate-fadeIn, .animate-slideIn, .animate-color, .animate-bounce, .animate-zoomIn, .animate-pulse, .animate-pop, .animate-flip').forEach(el => {
          el.style.animationPlayState = 'running';
        });
      } else {
        section.style.display = 'none';
        section.classList.add('hidden');
      }
    });
  }

  // Event listener for nav buttons
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      showSection(targetId);
      // Smooth scroll to the section
      document.getElementById(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Intersection Observer for animations when elements enter the viewport
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.animate-fadeIn, .animate-slideIn, .animate-color, .animate-bounce, .animate-zoomIn, .animate-pulse, .animate-pop, .animate-flip').forEach(el => {
    observer.observe(el);
  });

  // Parallax effect on Hero section
  let hero = document.querySelector('.hero');
  window.addEventListener('scroll', function() {
    let scrolled = window.pageYOffset;
    hero.style.backgroundPosition = `center ${-scrolled * 0.5}px`;
  });
});