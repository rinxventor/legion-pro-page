import { useEffect, useRef } from "react";
import { useReveal, hideOnError } from "../hooks.js";

const SPECS = [
  { type: "cat", text: "Performance" },
  { label: "Processor", value: "Intel® Core™ Ultra 9 275HX\nE-cores up to 4.60 GHz  ·  P-cores up to 5.40 GHz" },
  { label: "Operating System", value: "Windows 11 Home 64" },
  { label: "Graphic Card", value: "NVIDIA® GeForce RTX™ 5070 Ti Laptop GPU\n12GB GDDR7" },
  { label: "Memory", value: "32 GB DDR5-6400MT/s (CSODIMM)\n2 × 16 GB" },
  { label: "Storage", value: "1 TB SSD M.2 2280 PCIe Gen4 TLC" },
  { label: "Camera", value: "5MP with Dual Microphone" },
  { label: "Connectivity", value: "Wi-Fi 7 2×2 BE 320MHz\nBluetooth® 5.4" },
  { type: "cat", text: "Design" },
  { label: "Display", value: "16\" WQXGA (2560 × 1600), OLED, Glare, Non-Touch\nHDR 1000 True Black · 100% DCI-P3 · 500 nits\n240Hz · Low Blue Light" },
  { label: "Keyboard", value: "Per-Key RGB Backlit, Black — English" },
];

export default function Hero() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  useReveal(rootRef);

  /* Fade the pinned title as the user scrolls into the spec deck. */
  useEffect(() => {
    const pin = titleRef.current;
    if (!pin) return;
    const onScroll = () => {
      const y = window.scrollY;
      const fadeStart = 80;
      const fadeEnd = 450;
      const opacity = Math.max(0, 1 - (y - fadeStart) / (fadeEnd - fadeStart));
      pin.style.opacity = String(opacity);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="section1" aria-label="Hero" ref={rootRef}>
      <div className="hero-wrapper">
        <div className="hero-left">
          <div className="hero-title-pin" ref={titleRef}>
            <h1>
              <span className="hero-line-1">Legion Pro 7i</span>
              <br />
              <span className="hero-line-2">Gen 10 Intel (16&quot;)</span>
              <br />
              <span className="hero-line-3">
                with up to <span className="accent">RTX&nbsp;5090</span>
              </span>
            </h1>
          </div>

          <div className="hero-specs-scroll">
            {SPECS.map((s, i) =>
              s.type === "cat" ? (
                <div className="spec-card" key={i} data-reveal>
                  <div className="spec-category">{s.text}</div>
                </div>
              ) : (
                <div className="spec-card" key={i} data-reveal>
                  <div className="spec-label">{s.label}</div>
                  <div className="spec-value">
                    {s.value.split("\n").map((line, j) => (
                      <span key={j}>
                        {j > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
            <div style={{ height: "40vh" }} />
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-placeholder">
            {/* Desktop — Balanced (cyan) */}
            <img
              className="hero-desktop-cyan"
              src="images/hero/hero_desktop_cyan.webp"
              alt="Legion Pro 7i Gen 10 — Balanced desktop view"
              onError={hideOnError}
            />
            {/* Desktop — Gaming (red) */}
            <img
              className="hero-desktop-red"
              src="images/hero/hero_desktop_red.webp"
              alt="Legion Pro 7i Gen 10 — Gaming desktop view"
              onError={hideOnError}
            />
            {/* Mobile — Balanced (cyan) */}
            <img
              className="hero-mobile-cyan"
              src="images/hero/hero_mobile_cyan.webp"
              alt="Legion Pro 7i Gen 10"
              onError={hideOnError}
            />
            {/* Mobile — Gaming (red) */}
            <img
              className="hero-mobile-red"
              src="images/hero/hero_mobile_red.webp"
              alt="Legion Pro 7i Gen 10"
              onError={hideOnError}
            />
          </div>
        </div>
      </div>
    </section>
  );
}