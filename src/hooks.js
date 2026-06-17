import { useEffect } from "react";

/**
 * Adds a `.visible` class to every `[data-reveal]` element within the
 * referenced subtree once it scrolls into view. Reusable scroll-reveal.
 */
export function useReveal(ref, selector = "[data-reveal]") {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll(selector);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref, selector]);
}

/** Gracefully hide an <img> if its source fails to load. */
export function hideOnError(e) {
  e.currentTarget.style.visibility = "hidden";
}
