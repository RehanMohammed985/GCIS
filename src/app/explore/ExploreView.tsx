"use client";

import { useMemo, useState } from "react";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Reveal } from "@/components/Reveal";
import {
  FIELD_LABELS,
  type Field,
  type Opportunity,
  type VisaTrack,
} from "@/lib/types";

export function ExploreView({ all }: { all: Opportunity[] }) {
  const [track, setTrack] = useState<VisaTrack | "all">("all");
  const [field, setField] = useState<Field | "all">("all");
  const [query, setQuery] = useState("");

  // Only offer field chips that actually exist in the current track, so the
  // filter bar can never lead somewhere with zero results.
  const fieldsInTrack = useMemo(() => {
    const pool = track === "all" ? all : all.filter((o) => o.visaTrack === track);
    return Array.from(new Set(pool.flatMap((o) => o.fields))).sort();
  }, [all, track]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((o) => {
      if (track !== "all" && o.visaTrack !== track) return false;
      if (field !== "all" && !o.fields.includes(field)) return false;
      if (!q) return true;
      return (
        o.title.toLowerCase().includes(q) ||
        o.org.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    });
  }, [all, track, field, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="rise mb-12">
        <p className="eyebrow mb-5">The full corpus</p>
        <h1 className="display text-5xl sm:text-7xl mb-6">
          Everything we&apos;ve verified.
        </h1>
        <p className="text-mist max-w-xl leading-relaxed">
          Each listing was checked to exist and to be legally available on the
          visa track it&apos;s filed under.
        </p>
      </div>

      <div className="glass rounded-2xl p-5 mb-10 flex flex-col gap-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, organisation, or keyword…"
          className="w-full bg-transparent border-b border-white/10 pb-3 text-lg placeholder:text-faint focus:border-cyan-glow focus:outline-none transition-colors"
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">Track</span>
          {(
            [
              ["all", "All"],
              ["h4", "H4 · High school"],
              ["f1", "F1 · College"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => {
                setTrack(v);
                setField("all");
              }}
              className={`px-3.5 py-1.5 rounded-full text-sm border transition-all ${
                track === v
                  ? "bg-bone text-void border-bone"
                  : "border-white/12 text-mist hover:text-bone hover:border-white/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">Field</span>
          <button
            onClick={() => setField("all")}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-all ${
              field === "all"
                ? "bg-bone text-void border-bone"
                : "border-white/12 text-mist hover:text-bone hover:border-white/30"
            }`}
          >
            All
          </button>
          {fieldsInTrack.map((f) => (
            <button
              key={f}
              onClick={() => setField(f)}
              className={`px-3.5 py-1.5 rounded-full text-sm border transition-all ${
                field === f
                  ? "bg-bone text-void border-bone"
                  : "border-white/12 text-mist hover:text-bone hover:border-white/30"
              }`}
            >
              {FIELD_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <p className="font-mono text-xs text-faint mb-6">
        {visible.length} {visible.length === 1 ? "result" : "results"}
      </p>

      {visible.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <h2 className="font-display text-3xl mb-3">Nothing here.</h2>
          <p className="text-mist">Try a broader filter or a different term.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((opp, i) => (
            <Reveal key={opp.id} delay={Math.min(i, 6) * 50}>
              <OpportunityCard opp={opp} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
