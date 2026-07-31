"use client";

import { useSyncExternalStore } from "react";

const KEY = "gcis.theme";
const listeners = new Set<() => void>();

function current(): "light" | "dark" {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function ThemeToggle() {
  // Rendered as "light" on the server; the inline ThemeScript has already set
  // the real attribute by the time this hydrates, so only the icon swaps.
  const theme = useSyncExternalStore(subscribe, current, () => "light" as const);

  function toggle() {
    const next = current() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Private mode — the choice just won't persist.
    }
    for (const listener of listeners) listener();
  }

  // A word rather than a glyph: ☀/☾ have wildly inconsistent metrics across
  // platforms and clipped inside the nav's fixed row height.
  return (
    <button
      onClick={toggle}
      className="label text-ink-faint hover:text-ink transition-colors px-3 py-2 whitespace-nowrap"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
