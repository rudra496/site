// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Section reveal on scroll (fade in)
  const sections = document.querySelectorAll('.section');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "none";
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    revealObserver.observe(section);
  });

  // Visitor counter (using countapi.xyz)
  const counterEl = document.getElementById('visitorCount');
  if(counterEl) {
    fetch('https://api.countapi.xyz/hit/rudra-portfolio-2024/visits')
      .then(res => res.json())
      .then(res => {
        counterEl.textContent = `Visitors: ${res.value}`;
      })
      .catch(() => {
        counterEl.textContent = `Visitors: N/A`;
      });
  }
});
