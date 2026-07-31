"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Reveal } from "@/components/Reveal";
import { matchOpportunities } from "@/lib/match";
import { clearProfile, useProfile } from "@/lib/profile";
import {
  FIELD_LABELS,
  TYPE_LABELS,
  type Opportunity,
  type OpportunityType,
} from "@/lib/types";

export function DashboardView({ all }: { all: Opportunity[] }) {
  const { profile, ready } = useProfile();
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "all">("all");

  const matches = useMemo(
    () => (profile ? matchOpportunities(all, profile) : []),
    [all, profile],
  );

  const availableTypes = useMemo(
    () => Array.from(new Set(matches.map((m) => m.type))),
    [matches],
  );

  const visible = useMemo(
    () =>
      typeFilter === "all"
        ? matches
        : matches.filter((m) => m.type === typeFilter),
    [matches, typeFilter],
  );

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-32">
        <p className="eyebrow shimmer">Loading your matches…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="display text-5xl sm:text-6xl mb-6">
          No profile yet.
        </h1>
        <p className="text-mist mb-10 leading-relaxed">
          Answer three questions and we&apos;ll rank every opportunity against
          your visa status and your field.
        </p>
        <Link
          href="/start"
          className="inline-block px-8 py-4 rounded-full bg-bone text-void font-medium hover:bg-white transition-all hover:scale-[1.03]"
        >
          Build my profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="rise mb-14">
        <p className="eyebrow mb-5">
          {profile.track === "h4"
            ? "H4 · No work authorization"
            : "F1 · CPT/OPT eligible"}
        </p>
        <h1 className="display text-5xl sm:text-7xl mb-6">
          {matches.length} {matches.length === 1 ? "match" : "matches"}
          <span className="text-faint"> for you.</span>
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {profile.fields.map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-mist"
            >
              {FIELD_LABELS[f]}
            </span>
          ))}
          {profile.remoteOnly && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/25">
              Remote only
            </span>
          )}
          <button
            onClick={clearProfile}
            className="text-xs px-3 py-1.5 rounded-full border border-white/12 text-faint hover:text-bone hover:border-white/30 transition-colors"
          >
            Reset profile
          </button>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <h2 className="font-display text-3xl mb-4">
            Nothing matched those fields yet.
          </h2>
          <p className="text-mist mb-8 max-w-md mx-auto leading-relaxed">
            The corpus is still growing. Widen your interests, or browse
            everything available on your track.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/start"
              className="px-6 py-3 rounded-full bg-bone text-void font-medium hover:bg-white transition-colors"
            >
              Edit my fields
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-full border border-white/15 text-bone hover:bg-white/5 transition-colors"
            >
              Browse everything
            </Link>
          </div>
        </div>
      ) : (
        <>
          {availableTypes.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  typeFilter === "all"
                    ? "bg-bone text-void border-bone"
                    : "border-white/12 text-mist hover:text-bone hover:border-white/30"
                }`}
              >
                All {matches.length}
              </button>
              {availableTypes.map((t) => {
                const n = matches.filter((m) => m.type === t).length;
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      typeFilter === t
                        ? "bg-bone text-void border-bone"
                        : "border-white/12 text-mist hover:text-bone hover:border-white/30"
                    }`}
                  >
                    {TYPE_LABELS[t]} {n}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {visible.map((opp, i) => (
              <Reveal key={opp.id} delay={Math.min(i, 6) * 60}>
                <OpportunityCard opp={opp} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
