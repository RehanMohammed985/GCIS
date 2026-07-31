"use client";

import { useEffect, useRef } from "react";

/**
 * Fades content up as it enters the viewport.
 *
 * Toggles the class on the node directly rather than through state: this is
 * decoration with no bearing on the rendered output, so routing it through a
 * re-render would buy nothing. Unobserves after firing so elements don't
 * re-animate when scrolling back up.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add("shown");

    // Fail open. The reveal is decoration; content must never depend on it.
    // IntersectionObserver does not fire while the document is hidden, so a
    // page rendered in a background tab would otherwise stay blank.
    if (
      typeof IntersectionObserver === "undefined" ||
      document.visibilityState === "hidden"
    ) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
