// Function to toggle sections visibility
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.toggle-btn');
  const sections = document.querySelectorAll('.section');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-target');
      const section = document.getElementById(target);

      // Toggle the visibility of the clicked section
      section.classList.toggle('hidden');
      
      // Smooth scroll to the section
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });

  // Adding fade-in effect for sections on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    observer.observe(section);
  });
});
