"use client";

import { useMemo, useState } from "react";
import {
  FIELD_LABELS,
  TYPE_LABELS,
  type Field,
  type Opportunity,
  type OpportunityType,
  type VisaTrack,
} from "@/lib/types";

const SUBJECT_PREVIEW = 8;

/**
 * Filter controls for the index.
 *
 * Options are derived from the pool narrowed by the *other* active filters, so
 * the bar can never offer a combination that yields nothing. Counts are shown
 * next to each option for the same reason.
 */
export function FilterBar({
  pool,
  track,
  setTrack,
  field,
  setField,
  type,
  setType,
  query,
  setQuery,
  resultCount,
}: {
  pool: Opportunity[];
  track: VisaTrack | "all";
  setTrack: (v: VisaTrack | "all") => void;
  field: Field | "all";
  setField: (v: Field | "all") => void;
  type: OpportunityType | "all";
  setType: (v: OpportunityType | "all") => void;
  query: string;
  setQuery: (v: string) => void;
  resultCount: number;
}) {
  const [allSubjects, setAllSubjects] = useState(false);

  const inTrack = useMemo(
    () => (track === "all" ? pool : pool.filter((o) => o.visaTrack === track)),
    [pool, track],
  );

  const fields = useMemo(() => {
    const counts = new Map<Field, number>();
    for (const o of inTrack) {
      for (const f of o.fields) counts.set(f, (counts.get(f) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [inTrack]);

  const types = useMemo(() => {
    const counts = new Map<OpportunityType, number>();
    for (const o of inTrack) {
      if (field !== "all" && !o.fields.includes(field)) continue;
      counts.set(o.type, (counts.get(o.type) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [inTrack, field]);

  // Eighteen subjects push the first entry most of a screen down on mobile,
  // so the tail is collapsed until asked for. An active selection outside the
  // preview must stay visible, or it would vanish from its own filter bar.
  const shownFields =
    allSubjects || fields.findIndex(([f]) => f === field) >= SUBJECT_PREVIEW
      ? fields
      : fields.slice(0, SUBJECT_PREVIEW);

  const dirty =
    track !== "all" || field !== "all" || type !== "all" || query !== "";

  return (
    // Not sticky: with three facet rows this bar runs to ~330px and would
    // cover the first entries of the very list it filters.
    <div className="rule-t rule-b py-5 mb-2">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, organisation, keyword…"
            className="flex-1 bg-transparent border-0 border-b border-rule focus:border-ink focus:outline-none py-2 text-base transition-colors"
          />
          <span className="num text-sm text-ink-faint shrink-0">
            {resultCount}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="label text-ink-faint w-14 shrink-0">Track</span>
          <button
            className="chip"
            data-on={track === "all"}
            onClick={() => setTrack("all")}
          >
            All
          </button>
          {(["h4", "f1"] as const).map((t) => (
            <button
              key={t}
              className="chip"
              data-on={track === t}
              onClick={() => {
                setTrack(t);
                setField("all");
                setType("all");
              }}
            >
              {t.toUpperCase()}{" "}
              <span className="num opacity-60">
                {pool.filter((o) => o.visaTrack === t).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-start gap-x-2 gap-y-2">
          <span className="label text-ink-faint w-14 shrink-0 pt-2">
            Subject
          </span>
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              className="chip"
              data-on={field === "all"}
              onClick={() => setField("all")}
            >
              All
            </button>
            {shownFields.map(([f, n]) => (
              <button
                key={f}
                className="chip"
                data-on={field === f}
                onClick={() => {
                  setField(f);
                  setType("all");
                }}
              >
                {FIELD_LABELS[f]}{" "}
                <span className="num opacity-60">{n}</span>
              </button>
            ))}
            {fields.length > SUBJECT_PREVIEW && (
              <button
                className="chip !border-dashed"
                onClick={() => setAllSubjects((v) => !v)}
              >
                {allSubjects
                  ? "Fewer"
                  : `+${fields.length - SUBJECT_PREVIEW} more`}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-2 gap-y-2">
          <span className="label text-ink-faint w-14 shrink-0 pt-2">Kind</span>
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              className="chip"
              data-on={type === "all"}
              onClick={() => setType("all")}
            >
              All
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

          {dirty && (
            <button
              onClick={() => {
                setTrack("all");
                setField("all");
                setType("all");
                setQuery("");
              }}
              className="label text-accent hover:underline ml-auto pt-2"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
