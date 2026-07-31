"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EntryRow } from "@/components/EntryRow";
import { matchOpportunities } from "@/lib/match";
import { clearProfile, useProfile } from "@/lib/profile";
import {
  FIELD_LABELS,
  TYPE_LABELS,
  type Opportunity,
  type OpportunityType,
} from "@/lib/types";

export function MatchesView({ all }: { all: Opportunity[] }) {
  const { profile, ready } = useProfile();
  const [type, setType] = useState<OpportunityType | "all">("all");

  const matches = useMemo(
    () => (profile ? matchOpportunities(all, profile) : []),
    [all, profile],
  );

  const types = useMemo(() => {
    const counts = new Map<OpportunityType, number>();
    for (const m of matches) counts.set(m.type, (counts.get(m.type) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [matches]);

  const visible =
    type === "all" ? matches : matches.filter((m) => m.type === type);

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-20">
        <p className="label text-ink-faint">Reading your profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-20 pb-32">
        <p className="label text-ink-faint mb-6">Your matches</p>
        <h1 className="display text-[3rem] sm:text-[4.5rem] max-w-[12ch] mb-6">
          No profile yet.
        </h1>
        <p className="text-ink-soft max-w-lg leading-relaxed mb-10">
          Answer three questions and every entry in the index gets ranked
          against your visa status and your field — with the reasoning shown on
          each one.
        </p>
        <Link href="/start" className="btn">
          Build your profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <header className="pt-14 pb-10">
        <p className="label text-ink-faint mb-6">
          <span className={profile.track === "h4" ? "track-h4" : "track-f1"}>
            {profile.track.toUpperCase()}
          </span>{" "}
          —{" "}
          {profile.track === "h4"
            ? "no work authorization"
            : "CPT / OPT eligible"}
        </p>

        <h1 className="display text-[3rem] sm:text-[4.5rem] mb-8">
          <span className="num">{matches.length}</span>{" "}
          {matches.length === 1 ? "entry" : "entries"} fit you.
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rule-t pt-5">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {profile.fields.map((f) => (
              <span key={f} className="label text-ink">
                {FIELD_LABELS[f]}
              </span>
            ))}
          </div>
          {profile.remoteOnly && (
            <span className="label text-accent">Remote only</span>
          )}
          <div className="flex gap-4 ml-auto">
            <Link href="/start" className="label text-ink-faint link-draw">
              Edit
            </Link>
            <button
              onClick={clearProfile}
              className="label text-ink-faint hover:text-accent transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {matches.length === 0 ? (
        <div className="py-20 rule-t">
          <p className="display-tight text-3xl mb-4 max-w-[20ch]">
            Nothing in the index matches those subjects yet.
          </p>
          <p className="text-ink-soft max-w-lg leading-relaxed mb-8">
            {profile.remoteOnly
              ? "Remote-only is a hard filter, and much of the research on this track happens on campus. Widening your subjects or allowing on-site entries will open it up."
              : "Widening your subjects will open this up. The index is strongest in the sciences and computing."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/start" className="btn">
              Edit your profile
            </Link>
            <Link href="/index-of-opportunities" className="btn btn-ghost">
              Browse everything
            </Link>
          </div>
        </div>
      ) : (
        <>
          {types.length > 1 && (
            <div className="flex flex-wrap gap-2 pb-5">
              <button
                className="chip"
                data-on={type === "all"}
                onClick={() => setType("all")}
              >
                All <span className="num opacity-60">{matches.length}</span>
              </button>
              {types.map(([t, n]) => (
                <button
                  key={t}
                  className="chip"
                  data-on={type === t}
                  onClick={() => setType(t)}
                >
                  {TYPE_LABELS[t]} <span className="num opacity-60">{n}</span>
                </button>
              ))}
            </div>
          )}

          <div className="rule-t">
            {visible.map((opp, i) => (
              <EntryRow key={opp.id} opp={opp} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
