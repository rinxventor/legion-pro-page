/* ===========================
   LEGION PRO 7i GEN 10 — SCRIPT.JS
   Vanilla JS — No frameworks
   =========================== */

'use strict';

/* ==============================
   POLYFILL: Canvas roundRect
   ============================== */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

/* ==============================
   GLOBAL STATE
   ============================== */
const root = document.documentElement;
let currentTheme = 'balanced';
let lastCanvasProgress = 0;
window.drawPlaceholderFrame = function() {};

/* ==============================
   1. THEME SWITCHER
   ============================== */
const toggleWrap   = document.getElementById('theme-toggle');
const toggleLabel  = document.getElementById('theme-toggle-label');
const logoIcon     = document.getElementById('theme-logo-icon');

function setTheme(theme) {
  currentTheme = theme;

  if (theme === 'extreme') {
    root.setAttribute('data-theme', 'extreme');
    if (toggleLabel) toggleLabel.textContent = 'Extreme';
  } else {
    root.removeAttribute('data-theme');
    if (toggleLabel) toggleLabel.textContent = 'Balanced';
  }

  // Animate logo icon: trigger one 360° spin
  if (logoIcon) {
    logoIcon.classList.remove('spinning');
    // Force reflow to restart animation
    void logoIcon.offsetWidth;
    logoIcon.classList.add('spinning');
    logoIcon.addEventListener('animationend', () => {
      logoIcon.classList.remove('spinning');
    }, { once: true });
  }

  // Swap hero images — desktop
  const heroDesktop = document.getElementById('hero-image-desktop');
  if (heroDesktop) {
    heroDesktop.style.opacity = '0';
    setTimeout(() => {
      heroDesktop.src = theme === 'extreme'
        ? 'hero_img_desktop_red.jpeg'
        : 'hero_img_desktop_blue.jpeg';
      heroDesktop.onerror = () => { heroDesktop.style.display = 'none'; };
      heroDesktop.style.opacity = '1';
    }, 400);
  }

  // Swap hero images — mobile
  const heroMobile = document.getElementById('hero-image-mobile');
  if (heroMobile) {
    heroMobile.style.opacity = '0';
    setTimeout(() => {
      heroMobile.src = theme === 'extreme'
        ? 'hero_img_theme_red.jpeg'
        : 'hero_img_theme_blue.jpeg';
      heroMobile.onerror = () => { heroMobile.style.display = 'none'; };
      heroMobile.style.opacity = '1';
    }, 400);
  }

  // Redraw canvas with new theme colors
  drawPlaceholderFrame(lastCanvasProgress);
}

if (toggleWrap) {
  toggleWrap.addEventListener('click', () => {
    const next = currentTheme === 'balanced' ? 'extreme' : 'balanced';
    setTheme(next);
    toggleWrap.setAttribute('aria-pressed', next === 'extreme' ? 'true' : 'false');
  });

  toggleWrap.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const next = currentTheme === 'balanced' ? 'extreme' : 'balanced';
      setTheme(next);
      toggleWrap.setAttribute('aria-pressed', next === 'extreme' ? 'true' : 'false');
    }
  });
}

/* ==============================
   2. NAVBAR SCROLL EFFECT
   ============================== */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 60
      ? 'rgba(5,5,5,0.97)'
      : 'rgba(5,5,5,0.82)';
  }, { passive: true });
}

/* ==============================
   3. NAV ACTIVE LINK TRACKING
   Uses IntersectionObserver per section
   ============================== */
function initNavActiveLinks() {
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  if (!navLinks.length) return;

  // Map section IDs to nav links
  const sectionLinkMap = {};
  navLinks.forEach(link => {
    const sectionId = link.getAttribute('data-section');
    sectionLinkMap[sectionId] = link;
  });

  // Track which sections are currently intersecting
  const visibleSections = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (entry.isIntersecting) {
        visibleSections.add(id);
      } else {
        visibleSections.delete(id);
      }
    });
    updateActiveLink();
  }, {
    rootMargin: `-${parseInt(getComputedStyle(root).getPropertyValue('--nav-h') || '64')}px 0px -40% 0px`,
    threshold: 0
  });

  // Observe the tracked sections
  const trackedSections = ['section2', 'section3', 'section4', 'section5', 'section6'];
  trackedSections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  function updateActiveLink() {
    // Priority order
    const priority = ['section6', 'section5', 'section4', 'section3', 'section2'];
    let activeSection = null;

    for (const id of priority) {
      if (visibleSections.has(id)) {
        activeSection = id;
        break;
      }
    }

    // Map sections to nav links
    // section2 → Features, section5 → Tech Specs, section6 → Ports
    const sectionToNav = {
      'section2': 'section2',
      'section3': 'section2', // Features covers section3 too
      'section4': 'section2', // and section4
      'section5': 'section5',
      'section6': 'section6'
    };

    const activeLinkId = activeSection ? sectionToNav[activeSection] : null;

    navLinks.forEach(link => {
      const sid = link.getAttribute('data-section');
      if (activeLinkId && sid === activeLinkId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* ==============================
   4. SMOOTH ANCHOR SCROLLING
   ============================== */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        const navH = parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ==============================
   5. HERO SPEC CARDS — IntersectionObserver
   ============================== */
function initSpecCards() {
  const cards = document.querySelectorAll('.spec-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
}

/* ==============================
   6. HERO TITLE FADE ON SCROLL
   ============================== */
function initHeroTitleFade() {
  const pin = document.querySelector('.hero-title-pin');
  if (!pin) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const fadeStart = 80;
    const fadeEnd = 450;
    const opacity = Math.max(0, 1 - (scrolled - fadeStart) / (fadeEnd - fadeStart));
    pin.style.opacity = opacity;
  }, { passive: true });
}

/* ==============================
   7. SECTION 2 — CANVAS FRAME SCRUBBER
   ============================== */
const TOTAL_FRAMES = 900;

const canvasTexts = [
  [0.0,  0.2],
  [0.2,  0.4],
  [0.4,  0.6],
  [0.6,  0.8],
  [0.8,  1.0],
];

function initCanvasScrubber() {
  const section  = document.getElementById('section2');
  const canvas   = document.getElementById('scrub-canvas');
  if (!section || !canvas) return;

  const ctx          = canvas.getContext('2d');
  const textItems    = document.querySelectorAll('.canvas-text-item');
  const progressFill = document.querySelector('.canvas-progress-fill');

  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawPlaceholderFrame(lastCanvasProgress);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // ---- Drawing ----
  window.drawPlaceholderFrame = function(progress) {
    const W = canvas.width  / dpr;
    const H = canvas.height / dpr;

    const accent = currentTheme === 'extreme'
      ? { r: 229, g: 0,   b: 32  }
      : { r: 0,   g: 229, b: 255 };

    // Dark base
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#020208');
    bg.addColorStop(1, '#050510');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Primary radial glow
    const cx  = W * (0.3 + progress * 0.4);
    const cy  = H * 0.5;
    const rad = Math.min(W, H) * (0.3 + progress * 0.3);
    const r1  = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    r1.addColorStop(0,   `rgba(${accent.r},${accent.g},${accent.b},0.18)`);
    r1.addColorStop(0.5, `rgba(${accent.r},${accent.g},${accent.b},0.06)`);
    r1.addColorStop(1,   'transparent');
    ctx.fillStyle = r1;
    ctx.fillRect(0, 0, W, H);

    // Secondary glow
    const cx2 = W * (0.7 - progress * 0.3);
    const r2  = ctx.createRadialGradient(cx2, cy, 0, cx2, cy, rad * 0.7);
    r2.addColorStop(0, `rgba(${accent.r},${accent.g},${accent.b},0.08)`);
    r2.addColorStop(1, 'transparent');
    ctx.fillStyle = r2;
    ctx.fillRect(0, 0, W, H);

    // Scan lines
    for (let i = 0; i < H; i += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, i, W, 1);
    }

    // Laptop silhouette
    drawLaptopSilhouette(ctx, W, H, progress, accent);

    // Frame counter
    const frame = Math.round(progress * (TOTAL_FRAMES - 1));
    ctx.fillStyle = `rgba(${accent.r},${accent.g},${accent.b},0.3)`;
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`FRAME ${String(frame).padStart(4, '0')} / ${TOTAL_FRAMES}`, W - 20, H - 20);
  };

  function drawLaptopSilhouette(ctx, W, H, progress, accent) {
    const baseX  = W / 2;
    const baseY  = H / 2;
    const scale  = Math.min(W, H) * 0.35;
    const rotate = (progress - 0.5) * 0.3;

    ctx.save();
    ctx.translate(baseX, baseY);
    ctx.rotate(rotate);

    const alpha = 0.12 + progress * 0.08;

    // Screen border
    ctx.beginPath();
    ctx.roundRect(-scale * 0.7, -scale * 0.72, scale * 1.4, scale * 0.95, 8);
    ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Screen inner
    ctx.beginPath();
    ctx.roundRect(-scale * 0.62, -scale * 0.65, scale * 1.24, scale * 0.82, 4);
    ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${alpha * 0.6})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Base
    ctx.beginPath();
    ctx.roundRect(-scale * 0.78, scale * 0.23, scale * 1.56, scale * 0.16, 4);
    ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hinge
    ctx.beginPath();
    ctx.moveTo(-scale * 0.7, scale * 0.23);
    ctx.lineTo( scale * 0.7, scale * 0.23);
    ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${alpha * 0.5})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Keyboard dots
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 14; c++) {
        const kx = -scale * 0.58 + c * (scale * 1.16 / 13);
        const ky =  scale * 0.30 + r * (scale * 0.06);
        ctx.fillStyle = `rgba(${accent.r},${accent.g},${accent.b},${alpha * 0.5})`;
        ctx.fillRect(kx, ky, scale * 0.055, scale * 0.03);
      }
    }

    // Legion "L" logo
    ctx.font = `bold ${scale * 0.15}px sans-serif`;
    ctx.fillStyle = `rgba(${accent.r},${accent.g},${accent.b},${alpha * 1.5})`;
    ctx.textAlign = 'center';
    ctx.fillText('L', 0, -scale * 0.2);

    ctx.restore();
  }

  // Scroll scrub
  function onScroll() {
    const rect        = section.getBoundingClientRect();
    const totalHeight = section.offsetHeight - window.innerHeight;
    const scrolled    = -rect.top;
    const progress    = Math.max(0, Math.min(1, scrolled / totalHeight));

    lastCanvasProgress = progress;
    drawPlaceholderFrame(progress);

    if (progressFill) progressFill.style.width = (progress * 100) + '%';

    textItems.forEach((item, i) => {
      if (i >= canvasTexts.length) return;
      const [start, end] = canvasTexts[i];
      const mid   = (start + end) / 2;
      const range = (end - start) / 2;
      const dist  = Math.abs(progress - mid);
      item.style.opacity = Math.max(0, 1 - dist / range).toFixed(3);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==============================
   8. SECTION 3 — SUBSECTIONS FADE-IN
   ============================== */
function initSubsectionFade() {
  const subs = document.querySelectorAll('.sub-section');
  if (!subs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  subs.forEach(sub => observer.observe(sub));
}

/* ==============================
   9. SECTION 4 — CAROUSEL DRAG-TO-SCROLL
   Full mouse + touch grab-and-drag with
   instant pause and smooth resume.
   ============================== */
function initCarousels() {
  const wrappers = [
    { wrap: document.getElementById('carousel-wrap-1'), track: document.getElementById('carousel1') },
    { wrap: document.getElementById('carousel-wrap-2'), track: document.getElementById('carousel2') },
  ];

  wrappers.forEach(({ wrap, track }) => {
    if (!wrap || !track) return;

    let isDragging  = false;
    let startX      = 0;
    let startScroll = 0;    // wrap.scrollLeft at drag start
    let dragOffset  = 0;

    // We manipulate wrap's scrollLeft so animation pausing is clean.
    // On mouseenter/hover the CSS already pauses via :hover rule,
    // so we only need to handle the drag offset via translateX on the track
    // relative to the running animation.

    // MOUSE events on wrapper
    wrap.addEventListener('mousedown', e => {
      isDragging = true;
      startX     = e.clientX;
      dragOffset = 0;
      wrap.classList.add('is-dragging');
      track.style.animationPlayState = 'paused';
      e.preventDefault();
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      dragOffset = e.clientX - startX;
      // Apply temporary translateX offset over paused animation position
      track.style.transform = `translateX(${dragOffset}px)`;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      wrap.classList.remove('is-dragging');
      // Reset transform and resume animation
      track.style.transform = '';
      track.style.animationPlayState = 'running';
    });

    wrap.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        wrap.classList.remove('is-dragging');
        track.style.transform = '';
        track.style.animationPlayState = 'running';
      }
    });

    // TOUCH events on wrapper
    wrap.addEventListener('touchstart', e => {
      isDragging  = true;
      startX      = e.touches[0].clientX;
      dragOffset  = 0;
      track.style.animationPlayState = 'paused';
    }, { passive: true });

    wrap.addEventListener('touchmove', e => {
      if (!isDragging) return;
      dragOffset = e.touches[0].clientX - startX;
      track.style.transform = `translateX(${dragOffset}px)`;
    }, { passive: true });

    wrap.addEventListener('touchend', () => {
      isDragging = false;
      track.style.transform = '';
      track.style.animationPlayState = 'running';
    }, { passive: true });

    wrap.addEventListener('touchcancel', () => {
      isDragging = false;
      track.style.transform = '';
      track.style.animationPlayState = 'running';
    }, { passive: true });
  });
}

/* ==============================
   10. INIT ON DOM READY
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavActiveLinks();
  initSmoothAnchors();
  initSpecCards();
  initHeroTitleFade();
  initCanvasScrubber();
  initSubsectionFade();
  initCarousels();

  // Initial canvas draw
  drawPlaceholderFrame(0);
});
