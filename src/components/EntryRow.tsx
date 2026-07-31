"use client";

import Link from "next/link";
import {
  FIELD_LABELS,
  TYPE_LABELS,
  type Opportunity,
  type ScoredOpportunity,
} from "@/lib/types";
import { fitPercent } from "@/lib/match";
import { SaveButton } from "./SaveButton";

function isScored(o: Opportunity | ScoredOpportunity): o is ScoredOpportunity {
  return "score" in o;
}

/**
 * One line of the catalogue.
 *
 * Laid out as a record rather than a card: index number, then the entry, then
 * its metadata in a fixed right-hand column. The eye should be able to run
 * down the org column or the deadline column without snagging on box chrome.
 */
export function EntryRow({
  opp,
  index,
}: {
  opp: Opportunity | ScoredOpportunity;
  index: number;
}) {
  const scored = isScored(opp);
  const isLive = opp.id.startsWith("live-");

  return (
    <article className="entry group">
      <div className="py-6 grid gap-x-8 gap-y-4 lg:grid-cols-[3rem_minmax(0,1fr)_15rem]">
        <div className="hidden lg:block rail-num pt-1.5">
          {String(index + 1).padStart(3, "0")}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2">
            <span
              className={`label ${opp.visaTrack === "h4" ? "track-h4" : "track-f1"}`}
            >
              {opp.visaTrack.toUpperCase()}
            </span>
            <span className="label text-ink-faint">
              {TYPE_LABELS[opp.type]}
            </span>
            {opp.remote && <span className="label text-ink-faint">Remote</span>}
            {opp.capExempt && (
              <span className="label text-accent-2">Cap-exempt</span>
            )}
            {isLive && (
              <span className="label text-ink-faint border border-rule px-1.5">
                Live
              </span>
            )}
          </div>

          <h3 className="display-tight text-2xl sm:text-[1.75rem] mb-1.5">
            <Link
              href={`/opportunity/${encodeURIComponent(opp.id)}`}
              className="link-draw"
            >
              {opp.title}
            </Link>
          </h3>

          <p className="text-sm text-ink-soft mb-3">
            {opp.org} — {opp.location}
          </p>

          <p className="text-[0.9375rem] leading-relaxed text-ink-soft max-w-2xl">
            {opp.description}
          </p>

          {scored && opp.reasons.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1">
              {opp.reasons.slice(0, 2).map((reason) => (
                <li key={reason} className="text-sm text-ink flex gap-2">
                  <span className="text-accent">→</span>
                  {reason}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {opp.fields.slice(0, 4).map((f) => (
              <span key={f} className="text-xs text-ink-faint">
                {FIELD_LABELS[f]}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:text-right flex lg:flex-col gap-x-6 gap-y-2 flex-wrap items-start lg:items-end">
          {scored && (
            <div className="lg:mb-1">
              <span className="num text-2xl">{fitPercent(opp.score)}</span>
              <span className="label text-ink-faint ml-1">fit</span>
            </div>
          )}
          <div className="label text-ink-faint">{opp.deadline}</div>
          <div className="text-xs text-ink-faint">{opp.commitment}</div>
          <div className="flex items-center gap-3 lg:mt-2">
            <SaveButton id={opp.id} />
            <a
              href={opp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-ink link-draw"
            >
              Apply ↗
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
