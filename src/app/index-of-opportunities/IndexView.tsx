"use client";

import { useMemo, useState } from "react";
import { EntryRow } from "@/components/EntryRow";
import { FilterBar } from "@/components/FilterBar";
import {
  type Field,
  type Opportunity,
  type OpportunityType,
  type VisaTrack,
} from "@/lib/types";

const PAGE = 40;

export function IndexView({
  all,
  initialField,
  initialTrack,
}: {
  all: Opportunity[];
  initialField?: string;
  initialTrack?: string;
}) {
  const [track, setTrack] = useState<VisaTrack | "all">(
    initialTrack === "h4" || initialTrack === "f1" ? initialTrack : "all",
  );
  const [field, setField] = useState<Field | "all">(
    (initialField as Field) || "all",
  );
  const [type, setType] = useState<OpportunityType | "all">("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((o) => {
      if (track !== "all" && o.visaTrack !== track) return false;
      if (field !== "all" && !o.fields.includes(field)) return false;
      if (type !== "all" && o.type !== type) return false;
      if (!q) return true;
      return (
        o.title.toLowerCase().includes(q) ||
        o.org.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    });
  }, [all, track, field, type, query]);

  // Any filter change should return the reader to the top of the list rather
  // than leaving them 200 entries deep in a set that no longer exists.
  function reset<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setLimit(PAGE);
    };
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <header className="pt-14 pb-10">
        <p className="label text-ink-faint mb-6">The index</p>
        <h1 className="display text-[3rem] sm:text-[4.5rem] max-w-[13ch] mb-6">
          Everything we verified.
        </h1>
        <p className="text-ink-soft max-w-xl leading-relaxed">
          Each entry was checked to exist and checked against the eligibility
          rules of the track it is filed under. Entries marked{" "}
          <span className="label text-ink border border-rule px-1.5">Live</span>{" "}
          come from public job feeds and are not individually visa-vetted.
        </p>
      </header>

      <FilterBar
        pool={all}
        track={track}
        setTrack={reset(setTrack)}
        field={field}
        setField={reset(setField)}
        type={type}
        setType={reset(setType)}
        query={query}
        setQuery={reset(setQuery)}
        resultCount={visible.length}
      />

      {visible.length === 0 ? (
        <div className="py-24 text-center rule-t">
          <p className="display-tight text-3xl mb-3">Nothing matches.</p>
          <p className="text-ink-soft">
            Try a broader filter or a different term.
          </p>
        </div>
      ) : (
        <>
          <div className="rule-t">
            {visible.slice(0, limit).map((opp, i) => (
              <EntryRow key={opp.id} opp={opp} index={i} />
            ))}
          </div>

          {limit < visible.length && (
            <div className="py-12 flex justify-center">
              <button
                onClick={() => setLimit((l) => l + PAGE)}
                className="btn btn-ghost"
              >
                Show {Math.min(PAGE, visible.length - limit)} more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
