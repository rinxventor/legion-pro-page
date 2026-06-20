import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 288;

// Frame-index trigger thresholds + wireframe box geometry (% of stage).
const STOPS = [
  { frame: 20, box: { left: "32%", top: "14%", width: "36%", height: "48%" } },
  { frame: 60, box: { left: "18%", top: "54%", width: "64%", height: "26%" } },
  { frame: 110, box: { left: "8%", top: "36%", width: "84%", height: "22%" } },
  { frame: 170, box: { left: "28%", top: "16%", width: "44%", height: "62%" } },
  { frame: 260, box: { left: "18%", top: "56%", width: "64%", height: "34%" } },
];

const TEXTS = [
  { title: "Lenovo PureSight OLED Gaming Display", sub: '16" WQXGA · 240Hz · HDR 1000 True Black' },
  { title: "Legion True Strike Precision & Control", sub: "Per-Key RGB Backlit · Engineered for Victory" },
  { title: "All Essential Ports with Thunderbolt™ 4", sub: "USB-C 140W · HDMI 2.1 · Full Connectivity Suite" },
  { title: "Premium Aluminium Finish", sub: "Sleek · Rigid · Engineered to Last" },
  { title: "Legion Coldfront: Vapor", sub: "Vapor Chamber · HyperChamber · 250W+ TDP" },
];

function frameUrl(i) {
  return `frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.webp`;
}

function drawCover(ctx, img, w, h) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function drawFallback(ctx, w, h, progress, accent) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#020208");
  bg.addColorStop(1, "#06060f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w * (0.35 + progress * 0.3);
  const cy = h * 0.5;
  const rad = Math.min(w, h) * (0.35 + progress * 0.25);
  const r1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
  r1.addColorStop(0, `rgba(${accent.r},${accent.g},${accent.b},0.20)`);
  r1.addColorStop(0.5, `rgba(${accent.r},${accent.g},${accent.b},0.06)`);
  r1.addColorStop(1, "transparent");
  ctx.fillStyle = r1;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);

  const sc = Math.min(w, h) * 0.32;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate((progress - 0.5) * 0.3);
  ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},0.22)`;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-sc * 0.7, -sc * 0.72, sc * 1.4, sc * 0.95);
  ctx.strokeRect(-sc * 0.78, sc * 0.23, sc * 1.56, sc * 0.16);
  ctx.restore();
}

export default function ScrubSection({ theme }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const boxRef = useRef(null);
  const fillRef = useRef(null);
  const textRefs = useRef([]);

  const framesRef = useRef({ list: [], available: null });
  const lastProgressRef = useRef(0);
  const lastStopRef = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!section || !canvas || !stage) return;

    const ctx = canvas.getContext("2d");
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const accent =
      theme === "gaming"
        ? { r: 229, g: 0, b: 32 }
        : { r: 0, g: 229, b: 255 };

    /* ---- frame preloading (probe first to avoid 288 dead requests) ---- */
    function loadAll() {
      const f = framesRef.current;
      if (f.list.length) return;
      f.list = new Array(TOTAL_FRAMES).fill(null).map(() => ({ img: new Image(), loaded: false }));
      f.list.forEach((o, i) => {
        o.img.onload = () => {
          o.loaded = true;
          scheduleDraw();
        };
        o.img.src = frameUrl(i);
      });
    }
    function ensureFrames() {
      const f = framesRef.current;
      if (f.available === null) {
        const probe = new Image();
        probe.onload = () => {
          f.available = true;
          loadAll();
        };
        probe.onerror = () => {
          f.available = false;
        };
        probe.src = frameUrl(0);
      } else if (f.available && !f.list.length) {
        loadAll();
      }
    }

    function nearestLoaded(idx) {
      const f = framesRef.current;
      if (!f.list.length) return -1;
      for (let d = 0; d < f.list.length; d++) {
        for (const s of [d, -d]) {
          const j = idx + s;
          if (j >= 0 && j < f.list.length && f.list[j] && f.list[j].loaded) return j;
        }
      }
      return -1;
    }

    let drawQueued = false;
    function scheduleDraw() {
      if (drawQueued) return;
      drawQueued = true;
      requestAnimationFrame(() => {
        drawQueued = false;
        draw(lastProgressRef.current);
      });
    }

    function draw(progress) {
      const w = canvas.clientWidth || stage.clientWidth;
      const h = canvas.clientHeight || stage.clientHeight;
      if (!w || !h) return;
      const fi = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1))));
      ctx.clearRect(0, 0, w, h);
      const ji = nearestLoaded(fi);
      if (ji >= 0 && framesRef.current.available) {
        drawCover(ctx, framesRef.current.list[ji].img, w, h);
      } else {
        drawFallback(ctx, w, h, progress, accent);
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(lastProgressRef.current);
    }

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (total || 1)));
      lastProgressRef.current = progress;

      draw(progress);
      if (fillRef.current) fillRef.current.style.width = progress * 100 + "%";

      // text cross-fade per stop
      const fi = progress * (TOTAL_FRAMES - 1);
      const opacities = STOPS.map((s) => Math.max(0, 1 - Math.abs(fi - s.frame) / 45));
      textRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = opacities[i].toFixed(3);
      });

      // morph the wireframe box only when the active stop changes
      let idx = 0;
      let best = -1;
      opacities.forEach((o, i) => {
        if (o > best) {
          best = o;
          idx = i;
        }
      });
      if (idx !== lastStopRef.current) {
        lastStopRef.current = idx;
        const b = boxRef.current;
        const g = STOPS[idx].box;
        if (b) {
          b.style.left = g.left;
          b.style.top = g.top;
          b.style.width = g.width;
          b.style.height = g.height;
          b.style.opacity = "0.92";
        }
      }
    }

    ensureFrames();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();
    onScroll();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [theme]);

  return (
    <section id="section2" aria-label="3D Product Showcase" ref={sectionRef}>
      <div className="canvas-sticky">
        {/* Text relocated ABOVE the frame */}
        <div className="canvas-text-layer">
          {TEXTS.map((t, i) => (
            <div className="canvas-text-item" key={i} ref={(el) => (textRefs.current[i] = el)}>
              <h3>{t.title}</h3>
              <p>{t.sub}</p>
            </div>
          ))}
        </div>

        {/* Frame canvas — 80% width desktop / 4:3 full-width mobile */}
        <div className="canvas-stage" ref={stageRef}>
          <canvas ref={canvasRef} role="img" aria-label="Legion Pro 7i interactive showcase" />
          {/* Morphing highlight rectangle */}
          <div className="morph-box" ref={boxRef} />
        </div>

        <div className="canvas-progress-bar" aria-hidden="true">
          <div className="canvas-progress-fill" ref={fillRef} />
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.5)" }}>
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span>Scroll to Explore</span>
        </div>
      </div>
    </section>
  );
}