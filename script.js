// Morphing SVG blobs, smooth reveal/tilt, typewriter, color dot and hamburger nav, carousel
document.addEventListener('DOMContentLoaded', function () {
  // Morphing blobs
  const blobShps = [
    [
      'M415.5,319.5Q446,389,381,443.5Q316,498,243,472.5Q170,447,104,383.5Q38,320,68,237Q98,154,184,114Q270,74,347,109Q424,144,409.5,222Q395,300,415.5,319.5Z',
      'M343,116Q410,178,392.5,261Q375,344,332,430Q289,516,205,476Q121,436,144,357.5Q167,279,158.5,212Q150,145,218.5,119.5Q287,94,343,116Z'
    ],
    [
      'M435,346.5Q379,443,271,460.5Q163,478,117.5,384Q72,290,150.5,217.5Q229,145,322.5,110Q416,75,453,186Q490,297,435,346.5Z',
      'M377,99Q476,168,453.5,284.5Q431,401,324.5,429.5Q218,458,133,396.5Q48,335,103.5,237.5Q159,140,263,106.5Q367,73,377,99Z'
    ]
  ];
  function animateBlob(svgId, pathArr, speed = 7400) {
    const path = document.querySelector(`#${svgId} path`);
    let idx = 0, dir = 1;
    path.setAttribute('d', pathArr[0]);
    setInterval(() => {
      idx = (idx + dir + pathArr.length) % pathArr.length;
      path.animate([{d: path.getAttribute('d')}, {d: pathArr[idx]}], {duration: speed, fill: "forwards"});
      path.setAttribute('d', pathArr[idx]);
      if(idx === 0 || idx === pathArr.length-1) dir *= -1;
    }, speed);
  }
  animateBlob("blob1", blobShps[0], 7800);
  animateBlob("blob2", blobShps[1], 8900);

  // Animated color dots
  const dotsC = document.querySelector('.hero-bg .dots');
  if(dotsC){
    const dotCount = window.innerWidth < 700 ? 5 : 13;
    for(let i=0;i<dotCount;i++){
      let d=document.createElement('div');
      d.className="dot";
      d.style=`top:${Math.random()*80+5}vh;left:${Math.random()*90+2}vw;background:radial-gradient(circle at 40% 40%,${["#8f5cf7","#43e6fc","#ff9966","#e056fd"][i%4]} 60%,#fff0 100%);opacity:${0.22+Math.random()*0.17};animation-delay:${Math.random()*5}s;`;
      dotsC.appendChild(d);
    }
    // Animate dots
    const dots = document.querySelectorAll('.hero-bg .dot');
    function animateDots() {
      dots.forEach(dot=>{
        dot.animate([{transform:'scale(1)'},{transform:`scale(${1.2+Math.random()*0.5})`}],{duration:3200+Math.random()*2100, direction:'alternate',iterations:Infinity});
      });
    }
    animateDots();
  }

  // Hamburger nav
  const navToggle = document.querySelector('.nav-toggle');
  const navUl = document.querySelector('nav ul');
  navToggle.addEventListener('click', function() {
    navUl.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navUl.classList.contains('open') ? 'true' : 'false');
    if(navUl.classList.contains('open')) navUl.querySelector('a').focus();
  });
  // Close nav on link click (mobile)
  navUl.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if(window.innerWidth < 900) {
      navUl.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    }
  }));

  // Smooth scroll
  document.querySelectorAll('nav a[href^="#"], .to-top').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Section reveal on scroll (fade in)
  const reveals = document.querySelectorAll('.reveal, .section');
  const revealObserver = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  reveals.forEach(section => { revealObserver.observe(section); });

  // Nav active highlight on scroll
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = [...document.querySelectorAll('section')];
  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 120;
    let currentSection = sections[0];
    for (let s of sections) { if (scrollPos >= s.offsetTop) currentSection = s; }
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = Array.from(navLinks).find(link => link.getAttribute('href').slice(1) === currentSection.id);
    if (activeLink) activeLink.classList.add('active');
  });

  // Typewriter effect for hero headline
  const tw = document.getElementById('typewriter');
  if (tw) {
    const text = tw.innerHTML;
    let i = 0;
    tw.innerHTML = "";
    function type() {
      if (i < text.length) {
        tw.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, 36);
      }
    }
    setTimeout(type, 220);
  }

  // Tilt effect for cards (no tilt on mobile)
  function addTiltEffect(selector, maxTilt = 13) {
    if (window.innerWidth > 700) {
      document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', function(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width/2;
          const y = e.clientY - rect.top - rect.height/2;
          card.style.transform = `perspective(700px) rotateY(${x/rect.width*maxTilt}deg) rotateX(${-(y/rect.height*maxTilt)}deg) scale(1.08)`;
        });
        card.addEventListener('mouseleave', function() {
          card.style.transform = '';
        });
      });
    }
  }
  addTiltEffect('.tilt-hover', 14);

  // Scroll-to-top button
  const toTopBtn = document.querySelector('.to-top');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 260) {
      toTopBtn.style.opacity = '1';
      toTopBtn.style.pointerEvents = 'auto';
    } else {
      toTopBtn.style.opacity = '0';
      toTopBtn.style.pointerEvents = 'none';
    }
  });
  if(toTopBtn){ toTopBtn.style.opacity = '0'; toTopBtn.style.pointerEvents = 'none'; }

  // Certificate Carousel
  (function(){
    const carousel = document.querySelector('.carousel-certificates');
    if (!carousel) return;
    const imgs = carousel.querySelectorAll('img');
    const prevBtn = document.querySelector('.carousel-cert-btn.prev');
    const nextBtn = document.querySelector('.carousel-cert-btn.next');
    const indicators = document.querySelector('.carousel-cert-indicators');
    let current = 0, total = imgs.length;

    // Dots
    indicators.innerHTML = "";
    for(let i=0;i<total;i++){
      let dot = document.createElement('span');
      dot.className = "dot";
      if(i === 0) dot.classList.add('active');
      dot.tabIndex = 0;
      dot.setAttribute('aria-label', `Show certificate ${i+1}`);
      dot.addEventListener('click',()=>showCert(i));
      dot.addEventListener('keydown',(e)=>{if(e.key==='Enter'){showCert(i);}});
      indicators.appendChild(dot);
    }
    function update() {
      // Move the container, not individual images!
      carousel.style.transform = `translateX(-${current * 100}%)`;
      indicators.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===current));
    }
    function showCert(idx) {
      current = (idx+total)%total;
      update();
    }
    prevBtn.addEventListener('click',()=>showCert(current-1));
    nextBtn.addEventListener('click',()=>showCert(current+1));
    carousel.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft') showCert(current-1);
      if(e.key==='ArrowRight') showCert(current+1);
    });
    // Touch support/swipe for carousel
    let startX = null;
    carousel.addEventListener('touchstart',function(e){ startX = e.touches[0].clientX; },{passive:true});
    carousel.addEventListener('touchmove',function(e){
      if(startX !== null){
        let dx = e.touches[0].clientX - startX;
        if(Math.abs(dx)>40){
          if(dx>0) showCert(current-1); else showCert(current+1);
          startX = null;
        }
      }
    },{passive:true});
    carousel.addEventListener('touchend',function(){ startX = null; });
    // Initial update
    update();
  })();
});
