import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import ScrubSection from "./components/ScrubSection.jsx";
import Features from "./components/Features.jsx";
import Carousels from "./components/Carousels.jsx";
import TechSpecs from "./components/TechSpecs.jsx";
import PortsCTA from "./components/PortsCTA.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [theme, setTheme] = useState("balanced");

  /* THE FIX: reliably mirror React state into the root <html> attribute.
     CSS keys on [data-theme="gaming"] (consistent name — no more extreme/gaming mismatch). */
  useEffect(() => {
    const el = document.documentElement;
    if (theme === "gaming") {
      el.setAttribute("data-theme", "gaming");
    } else {
      el.removeAttribute("data-theme");
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "gaming" ? "balanced" : "gaming"));
  }, []);

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <ScrubSection theme={theme} />
        <Features />
        <Carousels />
        <TechSpecs />
        <PortsCTA />
      </main>
      <Footer />
    </>
  );
}
