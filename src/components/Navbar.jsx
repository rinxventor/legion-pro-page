import { useEffect, useState } from "react";
import { hideOnError } from "../hooks.js";

export default function Navbar({ theme, onToggleTheme }) {
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [spin, setSpin] = useState(false);

  const gaming = theme === "gaming";

  /* Active-link tracking via IntersectionObserver */
  useEffect(() => {
    const ids = ["section2", "section3", "section4", "section5", "section6"];
    const map = {
      section2: "features",
      section3: "features",
      section4: "features",
      section5: "specs",
      section6: "ports",
    };
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        });
        const order = ["section6", "section5", "section4", "section3", "section2"];
        let cur = null;
        for (const id of order) {
          if (visible.has(id)) {
            cur = id;
            break;
          }
        }
        setActive(cur ? map[cur] : null);
      },
      { rootMargin: "-64px 0px -55% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* Navbar background on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = () => {
    onToggleTheme();
    // Restart the 360° spin animation cleanly.
    setSpin(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setSpin(true))
    );
  };

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const navH = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav id="navbar" className={scrolled ? "scrolled" : ""} role="navigation" aria-label="Main navigation">
      <div className="nav-logo">
        <img
          className="nav-logo-img"
          src="images/navigation_bar/lenovo_logo.webp"
          alt="Lenovo Logo"
          onError={hideOnError}
        />
        <div className="nav-logo-text">Legion 7i</div>
      </div>

      <ul className="nav-links">
        <li>
          <a href="#section2" className={active === "features" ? "active" : ""} onClick={(e) => go(e, "section2")}>
            Features
          </a>
        </li>
        <li>
          <a href="#section5" className={active === "specs" ? "active" : ""} onClick={(e) => go(e, "section5")}>
            Tech Specs
          </a>
        </li>
        <li>
          <a href="#section6" className={active === "ports" ? "active" : ""} onClick={(e) => go(e, "section6")}>
            Ports &amp; Slots
          </a>
        </li>
      </ul>

      <div className="nav-right">
        <button
          type="button"
          className="theme-toggle"
          onClick={handleToggle}
          aria-pressed={gaming}
          aria-label="Toggle theme between Balanced and Gaming"
        >
          <span
            className={`theme-logo-orb${spin ? " spin" : ""}`}
            onAnimationEnd={() => setSpin(false)}
          >
            <img
              className="logo-cyan"
              src="images/navigation_bar/balancedmode_cyan_logo.webp"
              alt=""
              onError={hideOnError}
            />
            <img
              className="logo-red"
              src="images/navigation_bar/gamingmode_red_logo.webp"
              alt=""
              onError={hideOnError}
            />
          </span>
          <span className="theme-toggle-label">{gaming ? "Gaming" : "Balanced"}</span>
        </button>
        <a href="#section6" className="btn-buynow" role="button" onClick={(e) => go(e, "section6")}>
          Buy Now
        </a>
      </div>
    </nav>
  );
}