// Stars
  const starsContainer = document.getElementById('stars');
  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 0.5;
    const delay = Math.random() * 8;
    const duration = Math.random() * 4 + 3;
    const opacity = Math.random() * 0.7 + 0.2;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%; left:${Math.random()*100}%;
      --d:${duration}s; --o:${opacity};
      animation-delay:${delay}s;
    `;
    starsContainer.appendChild(star);
  }

  // Cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
  });
  function animateRing() {
    rx += (mx - rx - 18) * 0.12;
    ry += (my - ry - 18) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Intersection observer for confidence bars
  const fills = document.querySelectorAll('.conf-fill');
  fills.forEach(f => { const w = f.style.width; f.style.width = '0'; setTimeout(() => f.style.width = w, 300); });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.conf-fill');
        if (fill) {
          const target = fill.dataset.width || fill.className.includes('flood') ? '94%' :
            fill.className.includes('hurricane') ? '89%' :
            fill.className.includes('storm') ? '91%' : '97%';
          fill.style.width = target;
        }
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.event-card').forEach(c => obs.observe(c));

  // Trigger fills on load after delay
  setTimeout(() => {
    document.querySelector('.fill-flood').style.width = '94%';
    document.querySelector('.fill-hurricane').style.width = '89%';
    document.querySelector('.fill-storm').style.width = '91%';
    document.querySelector('.fill-fire').style.width = '97%';
  }, 800);

  // Nav scroll effect
  window.addEventListener('scroll', () => {
    document.querySelector('nav').style.background =
      window.scrollY > 50 ? 'rgba(3,8,16,0.85)' : 'rgba(3,8,16,0.6)';
  });