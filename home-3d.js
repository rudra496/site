document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-3d');
  if (!canvas) return;

  if (typeof THREE === 'undefined') {
    console.warn('THREE.js not found; hiding 3D canvas.');
    canvas.style.display = 'none';
    return;
  }

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent

    // Particle Geometry
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const particleCount = isMobile ? 2500 : 5000;

    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10; // Distribute in a cube
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0x00ffff, // Neon Cyan
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    camera.position.z = 5;

    // Mouse movement — smooth parallax
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate particle field
      particleMesh.rotation.y = elapsedTime * 0.1;
      particleMesh.rotation.x = elapsedTime * 0.05;

      // Ease camera toward mouse
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h);
    });
  } catch (e) {
    console.error('3D background initialization failed:', e);
    canvas.style.display = 'none';
  }
});