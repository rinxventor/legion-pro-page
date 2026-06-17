import { useEffect, useRef } from "react";
import { hideOnError } from "../hooks.js";

const TRACK1 = [
  { src: "images/carousels/fnq_with_intelligent_fan_mode.webp", alt: "Fn+Q Smart Profiles", tag: "Performance", title: "Fn+Q with Intelligent Fan Mode", desc: "Switch easily between Performance and Extreme Modes, optimizing cooling to match your gameplay and prevent overheating with additional integration of Lenovo AI Engine+ in Performance Mode." },
  { src: "images/carousels/legion_coldfront_vapor.webp", alt: "Coldfront Core Vapor Chambers", tag: "Thermal", title: "Legion Coldfront: Vapor", desc: "A combination of turbo-charged fans, a massive vapor chamber, and additional vacuum-sealed HyperChamber technology pushes your system to the absolute limit of peak gaming laptop performance." },
  { src: "images/carousels/massive_vapor_chamber_with_hyperchamber.webp", alt: "Vacuum Sealed HyperChamber Module", tag: "Thermal", title: "Massive Vapor Chamber with HyperChamber", desc: "The 250W vapor chamber delivers 15W more performance, ensuring quieter cooling and consistent gameplay without thermal throttling." },
  { src: "images/carousels/triple_tsi_fan_system.webp", alt: "High Static Pressure Triple TSI Fan Arrays", tag: "Thermal", title: "Triple TSI Fan System", desc: "Efficient airflow for maximum cooling under heavy loads, keeping your system ready for esports-level speed." },
  { src: "images/carousels/smart_fan_system_acoustic_ai_sound_sync.webp", alt: "Acoustic AI Dynamic Sound Sync Syncing", tag: "AI", title: "Smart Fan System & Acoustic AI Sound Sync", desc: "Detects the sound energy over speakers or headphones then adjusts fan speeds, or executes a power limiter to improve overall system performance and lower fan noise." },
];

const TRACK2 = [
  { src: "images/carousels/eco_friendly_esg_materials_green_packaging.webp", alt: "Sustainable Recycled Chassis Elements", tag: "Sustainability", title: "Eco-Friendly ESG Materials & Green Packaging", desc: "Constructed with sustainable materials and eco-friendly packaging, balancing top-tier performance with environmental responsibility." },
  { src: "images/carousels/legion_o_power_button.webp", alt: "Illuminated Power Core State Indicator", tag: "Design", title: "Legion O Power Button", desc: "Indicates, at a glance, if the laptop is in Balance, Performance, Quiet, or Extreme modes." },
  { src: "images/carousels/integrated_webcam_with_ai_sync.webp", alt: "AI Enhanced High Definition Video Stream Core", tag: "Camera", title: "Integrated Webcam with AI Sync", desc: "An AI-enhanced 5MP webcam delivers optimized video quality, suitable for streaming or team communication during gameplay." },
  { src: "images/carousels/desktop_performance_anywhere.webp", alt: "Desktop Grade Power Profiles Available Anywhere", tag: "Connectivity", title: "Desktop Performance Anywhere", desc: "Full speed 2.5G ethernet, HDMI 2.1, and more make this a gaming laptop that performs more like a desktop." },
  { src: "images/carousels/premium_aluminum_finish.webp", alt: "Sandblasted Premium Aluminum Enclosure", tag: "Design", title: "Premium Aluminum Finish", desc: "Sandblasted aluminum finish provides durability and a premium feel, built for the demands of competitive gaming and commuting." },
];

function InfiniteCarousel({ cards, direction = "left", speed = 50 }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const s = useRef({
    offset: direction === "right" ? null : 0,
    half: 0,
    dragging: false,
    paused: false,
    startX: 0,
    startOffset: 0,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const st = s.current;

    const measure = () => {
      // Exact wrap distance = offset of the first duplicate card. This keeps the
      // infinite loop perfectly seamless (flex `gap` makes scrollWidth/2 slightly off).
      const first = track.children[0];
      const dup = track.children[cards.length];
      st.half =
        first && dup ? dup.offsetLeft - first.offsetLeft : track.scrollWidth / 2 || track.scrollWidth;
      if (st.offset === null) st.offset = -st.half;
    };
    measure();
    const remeasureTimer = setTimeout(measure, 350);

    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!st.dragging && !st.paused) {
        const dir = direction === "left" ? -1 : 1;
        st.offset += dir * speed * dt;
        if (st.offset <= -st.half) st.offset += st.half;
        if (st.offset >= 0) st.offset -= st.half;
      }
      track.style.transform = `translate3d(${st.offset}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const onDown = (e) => {
      st.dragging = true;
      st.paused = true;
      st.startX = e.clientX;
      st.startOffset = st.offset;
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch (_) {}
      wrap.classList.add("is-dragging");
    };
    const onMove = (e) => {
      if (!st.dragging) return;
      st.offset = st.startOffset + (e.clientX - st.startX);
    };
    const normalize = () => {
      const h = st.half || 1;
      let o = st.offset % h;
      if (o >= 0) o -= h;
      if (o < -h) o += h;
      st.offset = o;
    };
    const onUp = (e) => {
      if (!st.dragging) return;
      st.dragging = false;
      normalize();
      st.paused = false;
      wrap.classList.remove("is-dragging");
      try {
        if (e && e.pointerId !== undefined) wrap.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    const onEnter = () => {
      if (!st.dragging) st.paused = true;
    };
    const onLeave = () => {
      if (!st.dragging) st.paused = false;
    };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(remeasureTimer);
      window.removeEventListener("resize", onResize);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [direction, speed]);

  const doubled = [...cards, ...cards];

  return (
    <div className="carousel-wrapper" ref={wrapRef}>
      <div className="carousel-track" ref={trackRef}>
        {doubled.map((c, i) => (
          <div className="carousel-card" key={i}>
            <div className="carousel-card-img">
              <img src={c.src} alt={c.alt} loading="lazy" onError={hideOnError} />
            </div>
            <div className="carousel-card-body">
              <div className="carousel-card-tag">{c.tag}</div>
              <div className="carousel-card-title">{c.title}</div>
              <p className="carousel-card-desc">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Carousels() {
  return (
    <section id="section4" aria-label="Feature Highlights">
      <div className="carousel-section-header">
        <h2>
          DESIGNED FOR ESPORTS GRANDMASTERS
          <span>Peak Performance, Comfort, &amp; Focus</span>
        </h2>
      </div>

      <InfiniteCarousel cards={TRACK1} direction="left" />
      <InfiniteCarousel cards={TRACK2} direction="right" />
    </section>
  );
}
