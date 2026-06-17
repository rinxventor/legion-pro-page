/* =====================================================================
   LEGION PRO 7i GEN 10 — INTERACTIONS (plain browser-native JavaScript)
   Exported: initInteractions()  ->  returns a cleanup function
   ===================================================================== */
'use strict';

const root = document.documentElement;

let currentTheme = 'balanced';
let lastCanvasProgress = 0;
let redrawCanvas = function () {};

/* ---------- helpers ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* =====================================================================
   1. THEME SWITCHER  (Balanced <-> Gaming)
   ===================================================================== */
function accentRGB() {
  return currentTheme === 'extreme'
    ? { r: 229, g: 0, b: 32 }
    : { r: 0, g: 229, b: 255 };
}

function setTheme(theme) {
  currentTheme = theme;
  const label = document.getElementById('theme-toggle-label');
  const stack = document.getElementById('theme-logo-stack');

  if (theme === 'extreme') {
    root.setAttribute('data-theme', 'extreme');
    if (label) label.textContent = 'Gaming';
  } else {
    root.removeAttribute('data-theme');
    if (label) label.textContent = 'Balanced';
  }

  // smooth 360 rotation of the active logo stack
  if (stack) {
    stack.classList.remove('spinning');
    void stack.offsetWidth;          // force reflow -> restart animation
    stack.classList.add('spinning');
    stack.addEventListener('animationend', () => stack.classList.remove('spinning'), { once: true });
  }

  // hero images cross-fade automatically via CSS (data-theme),
  // just repaint the canvas with the new accent
  redrawCanvas();
}

function initThemeToggle() {
  const toggleWrap = document.getElementById('theme-toggle');
  if (!toggleWrap) return;

  const handle = () => {
    const next = currentTheme === 'balanced' ? 'extreme' : 'balanced';
    setTheme(next);
    toggleWrap.setAttribute('aria-pressed', next === 'extreme' ? 'true' : 'false');
  };

  toggleWrap.addEventListener('click', handle);
  toggleWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handle();
    }
  });
}

/* =====================================================================
   2. NAVBAR SCROLL EFFECT
   ===================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.style.background = window.scrollY > 60
      ? 'rgba(5,5,5,0.97)'
      : 'rgba(5,5,5,0.82)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}

/* =====================================================================
   3. NAV ACTIVE LINK TRACKING
   ===================================================================== */
function initNavActiveLinks() {
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  if (!navLinks.length) return;

  const visible = new Set();
  const tracked = ['section2', 'section3', 'section4', 'section5', 'section6'];
  const sectionToNav = {
    section2: 'section2',
    section3: 'section2',
    section4: 'section2',
    section5: 'section5',
    section6: 'section6',
  };

  const updateActive = () => {
    const priority = ['section6', 'section5', 'section4', 'section3', 'section2'];
    let activeSection = null;
    for (const id of priority) {
      if (visible.has(id)) { activeSection = id; break; }
    }
    const activeLinkId = activeSection ? sectionToNav[activeSection] : null;
    navLinks.forEach((link) => {
      const sid = link.getAttribute('data-section');
      link.classList.toggle('active', !!(activeLinkId && sid === activeLinkId));
    });
  };

  const navH = parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 64;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (entry.isIntersecting) visible.add(id);
      else visible.delete(id);
    });
    updateActive();
  }, { rootMargin: `-${navH}px 0px -40% 0px`, threshold: 0 });

  tracked.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}

/* =====================================================================
   4. SMOOTH ANCHOR SCROLLING
   ===================================================================== */
function initSmoothAnchors() {
  const navH = parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 64;
  const handler = (e) => {
    const anchor = e.currentTarget;
    const href = anchor.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((a) => a.addEventListener('click', handler));
  return () => anchors.forEach((a) => a.removeEventListener('click', handler));
}

/* =====================================================================
   5. HERO SPEC CARDS — reveal
   ===================================================================== */
function initSpecCards() {
  const cards = document.querySelectorAll('.spec-card');
  if (!cards.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  cards.forEach((c) => observer.observe(c));
  return () => observer.disconnect();
}

/* =====================================================================
   6. HERO TITLE FADE ON SCROLL
   ===================================================================== */
function initHeroTitleFade() {
  const pin = document.querySelector('.hero-title-pin');
  if (!pin) return;
  const onScroll = () => {
    const scrolled = window.scrollY;
    const fadeStart = 80;
    const fadeEnd = 450;
    const opacity = Math.max(0, 1 - (scrolled - fadeStart) / (fadeEnd - fadeStart));
    pin.style.opacity = opacity;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}

/* =====================================================================
   7. SECTION 2 — FRAME SCRUB CANVAS + MORPH BOX
   ===================================================================== */
const FRAME_COUNT = 288;

const MORPH_KEYFRAMES = [
  { frame: 20,  left: 45, top: 15, width: 40, height: 50 }, // OLED GAMING DISPLAY
  { frame: 60,  left: 15, top: 55, width: 40, height: 30 }, // TRUE STRIKE PRECISION
  { frame: 110, left: 30, top: 30, width: 35, height: 20 }, // PORTS WITH THUNDERBOLT
  { frame: 170, left: 50, top: 40, width: 40, height: 40 }, // PREMIUM ALUMINIUM FINISH
  { frame: 260, left: 20, top: 50, width: 80, height: 40 }, // COLDFRONT VAPOUR
];
const TEXT_FRAMES = [20, 60, 110, 170, 260];

function getMorphBox(frame1) {
  const kf = MORPH_KEYFRAMES;
  if (frame1 <= kf[0].frame) return kf[0];
  if (frame1 >= kf[kf.length - 1].frame) return kf[kf.length - 1];
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1];
    if (frame1 >= a.frame && frame1 <= b.frame) {
      const t = (frame1 - a.frame) / (b.frame - a.frame);
      return {
        left: lerp(a.left, b.left, t),
        top: lerp(a.top, b.top, t),
        width: lerp(a.width, b.width, t),
        height: lerp(a.height, b.height, t),
      };
    }
  }
  return kf[kf.length - 1];
}

function drawCover(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  if (!iw || !ih) return;
  const sr = iw / ih, dr = w / h;
  let dw, dh;
  if (sr > dr) { dh = h; dw = h * sr; } else { dw = w; dh = w / sr; }
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function drawFallback(ctx, W, H, progress) {
  const accent = accentRGB();
  const ar = `${accent.r},${accent.g},${accent.b}`;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#020208');
  bg.addColorStop(1, '#070712');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const cx = W * (0.3 + progress * 0.4);
  const cy = H * 0.5;
  const rad = Math.max(40, Math.min(W, H) * (0.35 + progress * 0.25));
  const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
  g1.addColorStop(0, `rgba(${ar},0.22)`);
  g1.addColorStop(0.5, `rgba(${ar},0.06)`);
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  const cx2 = W * (0.7 - progress * 0.3);
  const g2 = ctx.createRadialGradient(cx2, cy, 0, cx2, cy, rad * 0.7);
  g2.addColorStop(0, `rgba(${ar},0.10)`);
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  // scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let i = 0; i < H; i += 4) ctx.fillRect(0, i, W, 1);

  drawLaptop(ctx, W, H, progress, accent);

  const frame = Math.round(progress * (FRAME_COUNT - 1)) + 1;
  ctx.fillStyle = `rgba(${ar},0.35)`;
  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`FRAME ${String(frame).padStart(3, '0')} / ${FRAME_COUNT}`, W - 16, H - 14);
}

function drawLaptop(ctx, W, H, progress, accent) {
  const scale = Math.min(W, H) * 0.32;
  const rotate = (progress - 0.5) * 0.3;
  const alpha = 0.14 + progress * 0.08;
  const ar = `${accent.r},${accent.g},${accent.b}`;

  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(rotate);

  if (!ctx.roundRect) ctx.roundRect = function (x, y, w, h, r) { /* noop guard */ };

  // screen
  ctx.beginPath();
  roundRectPath(ctx, -scale * 0.7, -scale * 0.72, scale * 1.4, scale * 0.95, 8);
  ctx.strokeStyle = `rgba(${ar},${alpha})`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // screen inner
  ctx.beginPath();
  roundRectPath(ctx, -scale * 0.62, -scale * 0.65, scale * 1.24, scale * 0.82, 4);
  ctx.strokeStyle = `rgba(${ar},${alpha * 0.6})`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // base
  ctx.beginPath();
  roundRectPath(ctx, -scale * 0.78, scale * 0.23, scale * 1.56, scale * 0.16, 4);
  ctx.strokeStyle = `rgba(${ar},${alpha})`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // keyboard dots
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 14; c++) {
      const kx = -scale * 0.58 + c * (scale * 1.16 / 13);
      const ky = scale * 0.3 + r * (scale * 0.06);
      ctx.fillStyle = `rgba(${ar},${alpha * 0.5})`;
      ctx.fillRect(kx, ky, scale * 0.055, scale * 0.03);
    }
  }

  // Legion "L"
  ctx.font = `bold ${scale * 0.15}px sans-serif`;
  ctx.fillStyle = `rgba(${ar},${Math.min(1, alpha * 1.6)})`;
  ctx.textAlign = 'center';
  ctx.fillText('L', 0, -scale * 0.2);

  ctx.restore();
}

function roundRectPath(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function initCanvasScrubber() {
  const section = document.getElementById('section2');
  const canvas = document.getElementById('scrub-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const textItems = document.querySelectorAll('.canvas-text-item');
  const progressFill = document.querySelector('.canvas-progress-fill');
  const morphBox = document.getElementById('morph-box');

  // ---- Preload 288 webp frames ----
  const frames = new Array(FRAME_COUNT);
  for (let i = 0; i < FRAME_COUNT; i++) {
    const idx = String(i + 1).padStart(3, '0');
    const img = new Image();
    img.decoding = 'async';
    img.onerror = () => { img._failed = true; };
    img.src = `frames/ezgif-frame-${idx}.webp`;
    frames[i] = img;
  }

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let cssW = 0, cssH = 0;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssW = canvas.offsetWidth;
    cssH = canvas.offsetHeight;
    if (!cssW || !cssH) return;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame(lastCanvasProgress);
  }

  function drawFrame(progress) {
    if (!cssW || !cssH) return;
    const fi = clamp(Math.round(progress * (FRAME_COUNT - 1)), 0, FRAME_COUNT - 1);
    const img = frames[fi];
    if (img && img.complete && img.naturalWidth > 0 && !img._failed) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cssW, cssH);
      drawCover(ctx, img, 0, 0, cssW, cssH);
    } else {
      drawFallback(ctx, cssW, cssH, progress);
    }
  }

  redrawCanvas = () => drawFrame(lastCanvasProgress);

  function applyMorph(frame1) {
    if (!morphBox) return;
    const b = getMorphBox(frame1);
    morphBox.style.left = b.left + '%';
    morphBox.style.top = b.top + '%';
    morphBox.style.width = b.width + '%';
    morphBox.style.height = b.height + '%';
  }

  function applyText(frame1) {
    textItems.forEach((item, i) => {
      if (i >= TEXT_FRAMES.length) return;
      const peak = TEXT_FRAMES[i];
      const prev = i > 0 ? TEXT_FRAMES[i - 1] : 0;
      const next = i < TEXT_FRAMES.length - 1 ? TEXT_FRAMES[i + 1] : FRAME_COUNT;
      const left = (prev + peak) / 2;
      const right = (peak + next) / 2;
      const span = (right - left) / 2;
      const dist = Math.abs(frame1 - peak);
      const op = span > 0 ? clamp(1 - dist / span, 0, 1) : 0;
      item.style.opacity = op.toFixed(3);
    });
  }

  let ticking = false;
  function update() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const progress = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
    lastCanvasProgress = progress;
    drawFrame(progress);
    if (progressFill) progressFill.style.width = (progress * 100) + '%';
    const frame1 = Math.round(progress * (FRAME_COUNT - 1)) + 1;
    applyMorph(frame1);
    applyText(frame1);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  // initial layout pass
  resizeCanvas();
  update();

  return () => {
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('scroll', onScroll);
  };
}

/* =====================================================================
   8. SECTION 3 — SUBSECTIONS FADE-IN
   ===================================================================== */
function initSubsectionFade() {
  const subs = document.querySelectorAll('.sub-section');
  if (!subs.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  subs.forEach((s) => observer.observe(s));
  return () => observer.disconnect();
}

/* =====================================================================
   9. SECTION 4 — CAROUSEL DRAG-TO-SCROLL (rAF)
   ===================================================================== */
function initCarousels() {
  const configs = [
    { wrapId: 'carousel-wrap-1', trackId: 'carousel1', dir: -1 }, // left-bound
    { wrapId: 'carousel-wrap-2', trackId: 'carousel2', dir: 1 },  // right-bound
  ];

  const cleanups = [];

  configs.forEach(({ wrapId, trackId, dir }) => {
    const wrap = document.getElementById(wrapId);
    const track = document.getElementById(trackId);
    if (!wrap || !track) return;

    let position = 0;
    const speed = 0.7;           // px per frame
    let isDragging = false;
    let lastX = 0;
    let pointerId = null;
    let inited = false;
    let rafId = 0;

    const halfWidth = () => track.offsetWidth / 2;

    function loop() {
      const half = halfWidth();
      if (!inited && half > 0) {
        position = dir < 0 ? 0 : -half;
        inited = true;
      }
      if (!isDragging) {
        position += dir * speed;
        if (half > 0) {
          if (dir < 0) {
            if (position <= -half) position += half;
          } else if (position >= 0) {
            position -= half;
          }
        }
      }
      track.style.transform = `translate3d(${position}px,0,0)`;
      rafId = requestAnimationFrame(loop);
    }

    const onDown = (e) => {
      isDragging = true;
      pointerId = e.pointerId;
      lastX = e.clientX;
      wrap.classList.add('is-dragging');
      try { wrap.setPointerCapture(pointerId); } catch (_) {}
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;   // target drag displacement (deltaX)
      lastX = e.clientX;
      position += dx;                 // apply translation to the track
    };
    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      wrap.classList.remove('is-dragging');
      try { if (pointerId != null) wrap.releasePointerCapture(pointerId); } catch (_) {}
      pointerId = null;
      // infinite auto-scroll resumes instantly via the rAF loop
    };

    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);

    // prevent native image drag ghosting
    const onDragStart = (e) => e.preventDefault();
    wrap.addEventListener('dragstart', onDragStart);

    rafId = requestAnimationFrame(loop);

    cleanups.push(() => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
      wrap.removeEventListener('dragstart', onDragStart);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/* =====================================================================
   10. INIT
   ===================================================================== */
export function initInteractions() {
  const cleanups = [];

  initThemeToggle();
  cleanups.push(initNavbarScroll());
  cleanups.push(initNavActiveLinks());
  cleanups.push(initSmoothAnchors());
  cleanups.push(initSpecCards());
  cleanups.push(initHeroTitleFade());
  cleanups.push(initCanvasScrubber());
  cleanups.push(initSubsectionFade());
  cleanups.push(initCarousels());

  // initial paint
  redrawCanvas();

  return () => cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); });
}
