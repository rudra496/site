// Modern Particle Wave Background Animation
(function() {
  'use strict';

  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const numParticles = 100;
  let animationId;
  let time = 0;

  // Particle class with wave motion
  class Particle {
    constructor(x, y, index) {
      this.baseX = x;
      this.baseY = y;
      this.x = x;
      this.y = y;
      this.index = index;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = this.getColor();
      this.connectionDistance = 150;
    }

    getColor() {
      const colors = [
        'rgba(0, 255, 255,',    // Cyan
        'rgba(255, 0, 255,',    // Magenta
        'rgba(138, 43, 226,',   // Blue Violet
        'rgba(0, 191, 255,',    // Deep Sky Blue
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      // Wave motion
      const waveAmplitude = 30;
      const waveFrequency = 0.001;
      
      this.x = this.baseX + Math.sin(time * waveFrequency + this.index * 0.1) * waveAmplitude;
      this.y = this.baseY + Math.cos(time * waveFrequency + this.index * 0.15) * waveAmplitude;

      // Drift motion
      this.baseX += this.speedX;
      this.baseY += this.speedY;

      // Bounce off edges
      if (this.baseX < 0 || this.baseX > width) this.speedX *= -1;
      if (this.baseY < 0 || this.baseY > height) this.speedY *= -1;

      // Keep within bounds
      this.baseX = Math.max(0, Math.min(width, this.baseX));
      this.baseY = Math.max(0, Math.min(height, this.baseY));
    }

    draw() {
      // Draw particle with glow effect
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      gradient.addColorStop(0, `${this.color} ${this.opacity})`);
      gradient.addColorStop(0.5, `${this.color} ${this.opacity * 0.5})`);
      gradient.addColorStop(1, `${this.color} 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    drawConnections() {
      // Only check particles with higher index to avoid duplicate connections
      for (let i = this.index + 1; i < particles.length; i++) {
        const particle = particles[i];
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.3;
          
          ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();
        }
      }
    }
  }

  // Initialize canvas size
  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // Initialize particles in a grid pattern with randomness
  function initParticles() {
    particles = [];
    const cols = Math.ceil(Math.sqrt(numParticles * (width / height)));
    const rows = Math.ceil(numParticles / cols);
    const spacingX = width / (cols + 1);
    const spacingY = height / (rows + 1);

    let index = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (index >= numParticles) break;
        
        const x = spacingX * (j + 1) + (Math.random() - 0.5) * spacingX * 0.5;
        const y = spacingY * (i + 1) + (Math.random() - 0.5) * spacingY * 0.5;
        
        particles.push(new Particle(x, y, index));
        index++;
      }
    }
  }

  // Animation loop
  function animate() {
    time++;
    
    // Create trailing effect
    ctx.fillStyle = 'rgba(10, 10, 26, 0.15)';
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
    });

    // Draw connections first (behind particles)
    particles.forEach(particle => {
      particle.drawConnections();
    });

    // Draw particles on top
    particles.forEach(particle => {
      particle.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Handle window resize
  function handleResize() {
    resizeCanvas();
    initParticles();
  }

  // Initialize and start animation
  function init() {
    resizeCanvas();
    initParticles();
    animate();

    // Add resize listener with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 200);
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup function (optional - for SPA navigation)
  window.stopStarfield = function() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
})();
