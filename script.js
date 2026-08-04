/* ===================================
   RJP GROUP — JAVASCRIPT
   100% Instant Preloading, Smooth Lerp & Zero-Lag User Experience
   =================================== */

// Register GSAP ScrollTrigger
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── PARALLEL BACKGROUND IMAGE PRELOADING (STARTS IMMEDIATELY) ──────────────
const TOTAL_BUILDING_FRAMES = 200;
const buildingImages = [];
let buildingLoadedCount = 0;
let targetBuildingFrameIndex = 0;
let currentBuildingFrameIndex = 0;

const TOTAL_CAR_FRAMES = 240;
const carImages = [];
let carLoadedCount = 0;
let targetCarFrameIndex = 0;
let currentCarFrameIndex = 0;

const TOTAL_CSC_FRAMES = 66;
const cscImages = [];
let cscLoadedCount = 0;
let targetCscFrameIndex = 0;
let currentCscFrameIndex = 0;

// Start fetching frames immediately in background
preloadBuildingImages();
preloadCarImages();
preloadCscImages();

// ─── INTRO ANIMATION (PLAYS ONLY ON INITIAL SITE OPENING) ────────────────────
(function () {
  const intro    = document.getElementById('intro-screen');
  const mainSite = document.getElementById('main-site');
  const INTRO_DURATION = 2800; // ms

  // Check if intro has already been played during this session / navigation
  if (sessionStorage.getItem('rjp_intro_played') === 'true') {
    if (intro) intro.style.display = 'none';
    if (mainSite) mainSite.classList.remove('hidden');
    document.body.style.overflow = 'auto';
    initPage();
    return;
  }

  function spawnParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['#E65C00', '#FF8C42', '#F9A825', '#FFD580', '#FF6B35'];
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 40}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        --dur: ${2 + Math.random() * 3}s;
        --delay: ${Math.random() * 2}s;
      `;
      container.appendChild(p);
    }
  }
  spawnParticles();

  setTimeout(function () {
    if (intro) {
      intro.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      intro.style.opacity = '0';
      intro.style.transform = 'scale(1.05)';
    }
    setTimeout(function () {
      if (intro) intro.style.display = 'none';
      if (mainSite) mainSite.classList.remove('hidden');
      document.body.style.overflow = 'auto';
      sessionStorage.setItem('rjp_intro_played', 'true');
      initPage();
    }, 700);
  }, INTRO_DURATION);

  document.body.style.overflow = 'hidden';
})();

// ─── INIT PAGE COMPONENTS ───────────────────────────────────────────────────
function initPage() {
  initLiveHeroBackground();
  initHero3dTilt();
  initNavbar();
  initSmoothScrollScrubEngine();
  initSmoothScroll();
  initHamburger();
  initContactForm();
  initScrollProgressBar();

  // Draw initial frames immediately
  resizeBuildingCanvas();
  resizeCarCanvas();
  resizeCscCanvas();
}

// ─── 1. DYNAMIC LIVE ANIMATED BACKGROUND BEHIND LOGO ─────────────────────────
function initLiveHeroBackground() {
  const canvas = document.getElementById('heroBgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(60, Math.floor(width / 25));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 3 + 2,
      alpha: Math.random() * 0.6 + 0.3,
      color: i % 2 === 0 ? 'rgba(230, 92, 0,' : 'rgba(249, 168, 37,'
    });
  }

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let waveOffset = 0;

  function renderHeroBg() {
    ctx.clearRect(0, 0, width, height);

    waveOffset += 0.01;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    for (let x = 0; x <= width; x += 20) {
      const y = Math.sin(x * 0.004 + waveOffset) * 45 + Math.cos(x * 0.002 + waveOffset) * 25 + height * 0.5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(255, 220, 190, 0.35)');
    grad.addColorStop(1, 'rgba(255, 245, 235, 0.08)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(230, 92, 0, 0.8)';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        p.x += (dx / dist) * 0.4;
        p.y += (dy / dist) * 0.4;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const pdx = p.x - p2.x;
        const pdy = p.y - p2.y;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

        if (pdist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(230, 92, 0, ${0.25 * (1 - pdist / 140)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(renderHeroBg);
  }

  renderHeroBg();
}

// ─── HERO 3D TILT LOGO CARD ───────────────────────────────────────────────────
function initHero3dTilt() {
  const card = document.getElementById('hero3dCard');
  if (!card) return;

  window.addEventListener('mousemove', function (e) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (-mouseY / (rect.height / 2)) * 12;
    const rotateY = (mouseX / (rect.width / 2)) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', function () {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

// ─── UTILITY: ULTRA HD CANVAS COVER DRAWING ──────────────────────────────────
function drawImageFitBox(ctx, img) {
  if (!img || !img.complete || img.naturalWidth === 0) return;
  const canvas = ctx.canvas;
  const cWidth = canvas.width;
  const cHeight = canvas.height;
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const hRatio = cWidth / imgWidth;
  const vRatio = cHeight / imgHeight;
  const ratio = Math.max(hRatio, vRatio);

  const drawWidth = imgWidth * ratio;
  const drawHeight = imgHeight * ratio;

  const offsetX = (cWidth - drawWidth) / 2;
  const offsetY = (cHeight - drawHeight) / 2;

  ctx.clearRect(0, 0, cWidth, cHeight);
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight, offsetX, offsetY, drawWidth, drawHeight);
}

// ─── 2. RJP CONSTRUCTION SEQUENCE PRELOADING ──────────────────────────────────
function renderBuildingFrame(index) {
  const canvas = document.getElementById('buildingCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const img = buildingImages[index];
    if (img) drawImageFitBox(ctx, img);
  }
}

function resizeBuildingCanvas() {
  const canvas = document.getElementById('buildingCanvas');
  if (!canvas) return;
  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  renderBuildingFrame(Math.round(currentBuildingFrameIndex));
}

function preloadBuildingImages() {
  for (let i = 1; i <= TOTAL_BUILDING_FRAMES; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `assets/building-animation/ezgif-frame-${frameNum}.jpg`;
    img.onload = () => {
      buildingLoadedCount++;
      if (i === 1) {
        renderBuildingFrame(0);
        const loader = document.getElementById('buildingLoader');
        if (loader) { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 300); }
      }
    };
    buildingImages.push(img);
  }
}

// ─── 3. RJP TRAVELS SEQUENCE PRELOADING ───────────────────────────────────────
function renderCarFrame(index) {
  const canvas = document.getElementById('carCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const img = carImages[index];
    if (img) drawImageFitBox(ctx, img);
  }
}

function resizeCarCanvas() {
  const canvas = document.getElementById('carCanvas');
  if (!canvas) return;
  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  renderCarFrame(Math.round(currentCarFrameIndex));
}

function preloadCarImages() {
  for (let i = 1; i <= TOTAL_CAR_FRAMES; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `assets/car-animation/ezgif-frame-${frameNum}.jpg`;
    img.onload = () => {
      carLoadedCount++;
      if (i === 1) {
        renderCarFrame(0);
        const loader = document.getElementById('carLoader');
        if (loader) { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 300); }
      }
    };
    carImages.push(img);
  }
}

// ─── 4. RJP CSC CENTER SEQUENCE PRELOADING ───────────────────────────────────
function renderCscFrame(index) {
  const canvas = document.getElementById('cscCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const img = cscImages[index];
    if (img) drawImageFitBox(ctx, img);
  }
}

function resizeCscCanvas() {
  const canvas = document.getElementById('cscCanvas');
  if (!canvas) return;
  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  renderCscFrame(Math.round(currentCscFrameIndex));
}

function preloadCscImages() {
  for (let i = 1; i <= TOTAL_CSC_FRAMES; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `assets/csc-center-animation/ezgif-frame-${frameNum}.jpg`;
    img.onload = () => {
      cscLoadedCount++;
      if (i === 1) {
        renderCscFrame(0);
        const loader = document.getElementById('cscLoader');
        if (loader) { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 300); }
      }
    };
    cscImages.push(img);
  }
}

// ─── 5. CARD STACKING OVERLAP & BUTTON DISPLAY ENGINE ─────────────────────────
function initSmoothScrollScrubEngine() {
  function updateTargets() {
    // 1. CONSTRUCTION SCRUB
    const constSec = document.getElementById('construction');
    if (constSec) {
      const rect = constSec.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      let rawProgress = -rect.top / (scrollableDist * 0.38);
      let progress = Math.max(0, Math.min(1, rawProgress));

      targetBuildingFrameIndex = Math.min(
        TOTAL_BUILDING_FRAMES - 1,
        Math.floor(progress * (TOTAL_BUILDING_FRAMES - 1))
      );

      const ctaWrap = document.getElementById('buildingCtaWrap');
      if (ctaWrap) {
        if (progress >= 0.95) {
          ctaWrap.classList.add('visible');
        } else {
          ctaWrap.classList.remove('visible');
        }
      }
    }

    // 2. TRAVELS SCRUB
    const travelSec = document.getElementById('travels');
    if (travelSec) {
      const rect = travelSec.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      let rawProgress = -rect.top / (scrollableDist * 0.38);
      let progress = Math.max(0, Math.min(1, rawProgress));

      targetCarFrameIndex = Math.min(
        TOTAL_CAR_FRAMES - 1,
        Math.floor(progress * (TOTAL_CAR_FRAMES - 1))
      );

      const ctaWrap = document.getElementById('carCtaWrap');
      if (ctaWrap) {
        if (progress >= 0.95) {
          ctaWrap.classList.add('visible');
        } else {
          ctaWrap.classList.remove('visible');
        }
      }
    }

    // 3. CSC CENTER SCRUB
    const cscSec = document.getElementById('csc');
    if (cscSec) {
      const rect = cscSec.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      let rawProgress = -rect.top / (scrollableDist * 0.38);
      let progress = Math.max(0, Math.min(1, rawProgress));

      targetCscFrameIndex = Math.min(
        TOTAL_CSC_FRAMES - 1,
        Math.floor(progress * (TOTAL_CSC_FRAMES - 1))
      );

      const ctaWrap = document.getElementById('cscCtaWrap');
      if (ctaWrap) {
        if (progress >= 0.95) {
          ctaWrap.classList.add('visible');
        } else {
          ctaWrap.classList.remove('visible');
        }
      }
    }
  }

  window.addEventListener('scroll', updateTargets, { passive: true });
  updateTargets();

  // Continuous 60FPS Lerp Loop for Ultra-Smooth Animation
  function smoothLerpLoop() {
    if (Math.abs(targetBuildingFrameIndex - currentBuildingFrameIndex) > 0.01) {
      currentBuildingFrameIndex += (targetBuildingFrameIndex - currentBuildingFrameIndex) * 0.18;
      renderBuildingFrame(Math.round(currentBuildingFrameIndex));
    }

    if (Math.abs(targetCarFrameIndex - currentCarFrameIndex) > 0.01) {
      currentCarFrameIndex += (targetCarFrameIndex - currentCarFrameIndex) * 0.18;
      renderCarFrame(Math.round(currentCarFrameIndex));
    }

    if (Math.abs(targetCscFrameIndex - currentCscFrameIndex) > 0.01) {
      currentCscFrameIndex += (targetCscFrameIndex - currentCscFrameIndex) * 0.18;
      renderCscFrame(Math.round(currentCscFrameIndex));
    }

    requestAnimationFrame(smoothLerpLoop);
  }

  smoothLerpLoop();
}

// ─── TOP SCROLL PROGRESS BAR ──────────────────────────────────────────────────
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalScroll) * 100;
    bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }, { passive: true });
}

// ─── NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT ────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
function initHamburger() {
  const btn   = document.getElementById('hamburgerBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', function () {
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
    });
  });
}

// ─── PRECISION SMOOTH ANCHOR SCROLLING ───────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        let top = target.offsetTop;

        // Custom target offsets for sticky stacked sections
        if (targetId === '#home') {
          top = 0;
        } else if (targetId === '#construction') {
          top = target.offsetTop + 20;
        } else if (targetId === '#travels') {
          top = target.offsetTop + 20;
        } else if (targetId === '#csc') {
          top = target.offsetTop + 20;
        } else if (targetId === '#contact') {
          top = target.offsetTop - 70;
        }

        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Handle URL hash on load
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        let top = target.offsetTop + 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  }
}

// ─── CONTACT FORM (DIRECT WHATSAPP REDIRECT) ───────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phoneNo').value.trim();
    const service = document.getElementById('serviceSelect').value;
    const message = document.getElementById('messageText').value.trim();

    const msg = `*RJP Group - General Contact Message*\n\n` +
                `👤 *Name:* ${name}\n` +
                `📞 *Phone:* ${phone}\n` +
                `🛠️ *Service Interested:* ${service}\n` +
                `💬 *Message:* ${message || 'N/A'}`;

    const url = `https://wa.me/917358656647?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    form.reset();
  });
}
