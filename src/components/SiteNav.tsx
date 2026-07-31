"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useSavedCount } from "@/lib/saved";

const LINKS = [
  { href: "/index-of-opportunities", label: "Index" },
  { href: "/matches", label: "Matches" },
  { href: "/guide", label: "Rules" },
];

export function SiteNav() {
  const pathname = usePathname();
  const savedCount = useSavedCount();
  // The sheet is stored as "open for this route" rather than a bare boolean,
  // so navigating away closes it as a consequence of the path changing —
  // no effect syncing state after the fact.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-[2px] rule-b">
      <nav className="mx-auto max-w-[1400px] px-5 sm:px-8 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-2.5 shrink-0">
          <span className="display-tight text-xl">GCIS</span>
          <span className="label text-ink-faint hidden sm:inline">
            Est. index
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`label px-3 py-2 transition-colors ${
                  active ? "text-ink" : "text-ink-faint hover:text-ink"
                }`}
              >
                {link.label}
                {active && <span className="text-accent"> ·</span>}
              </Link>
            );
          })}
          <Link
            href="/saved"
            className={`label px-3 py-2 transition-colors ${
              pathname.startsWith("/saved")
                ? "text-ink"
                : "text-ink-faint hover:text-ink"
            }`}
          >
            Saved
            {savedCount > 0 && (
              <span className="num text-accent ml-1">[{savedCount}]</span>
            )}
          </Link>
          <ThemeToggle />
          <Link href="/start" className="btn ml-2 !py-2 !px-4">
            Begin
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpenFor(open ? null : pathname)}
            className="label px-3 py-2 text-ink"
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden rule-t bg-paper-raised">
          {[...LINKS, { href: "/saved", label: `Saved (${savedCount})` }].map(
            (link) => (
              <Link
                key={link.href}
                href={link.href}
                className="label block px-5 py-4 rule-b text-ink"
              >
                {link.label}
              </Link>
            ),
          )}
          <div className="p-5">
            <Link href="/start" className="btn w-full justify-center">
              Begin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
