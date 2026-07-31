"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EntryRow } from "@/components/EntryRow";
import { useSavedIds } from "@/lib/saved";
import type { Opportunity } from "@/lib/types";

export function SavedView({ all }: { all: Opportunity[] }) {
  const ids = useSavedIds();

  const saved = useMemo(() => {
    const order = new Map(ids.map((id, i) => [id, i]));
    return all
      .filter((o) => order.has(o.id))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }, [all, ids]);

  // A live listing that has since rotated out of its feed leaves a saved id
  // with nothing behind it. Say so rather than silently dropping the count.
  const missing = ids.length - saved.length;

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <header className="pt-14 pb-10">
        <p className="label text-ink-faint mb-6">Saved</p>
        <h1 className="display text-[3rem] sm:text-[4.5rem] mb-6">
          {saved.length === 0 ? (
            "Nothing saved yet."
          ) : (
            <>
              <span className="num">{saved.length}</span> set aside.
            </>
          )}
        </h1>
        {saved.length === 0 && (
          <>
            <p className="text-ink-soft max-w-lg leading-relaxed mb-10">
              Star anything in the index and it collects here, stored in your
              browser. Nothing is sent anywhere.
            </p>
            <Link href="/index-of-opportunities" className="btn">
              Browse the index
            </Link>
          </>
        )}
        {missing > 0 && (
          <p className="text-sm text-ink-faint">
            <span className="num">{missing}</span>{" "}
            {missing === 1 ? "entry is" : "entries are"} no longer available —
            live postings expire when the employer closes them.
          </p>
        )}
      </header>

      {saved.length > 0 && (
        <div className="rule-t">
          {saved.map((opp, i) => (
            <EntryRow key={opp.id} opp={opp} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
