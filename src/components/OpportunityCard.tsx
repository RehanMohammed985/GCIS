import {
  FIELD_LABELS,
  TYPE_LABELS,
  type Opportunity,
  type ScoredOpportunity,
} from "@/lib/types";
import { fitPercent } from "@/lib/match";

const TYPE_TINT: Record<string, string> = {
  research: "text-cyan-glow border-cyan-glow/30 bg-cyan-glow/8",
  volunteer: "text-amber-glow border-amber-glow/30 bg-amber-glow/8",
  "open-source": "text-violet-glow border-violet-glow/30 bg-violet-glow/8",
  competition: "text-rose-glow border-rose-glow/30 bg-rose-glow/8",
  certification: "text-mist border-white/15 bg-white/5",
  internship: "text-cyan-glow border-cyan-glow/30 bg-cyan-glow/8",
  job: "text-violet-glow border-violet-glow/30 bg-violet-glow/8",
  fellowship: "text-amber-glow border-amber-glow/30 bg-amber-glow/8",
};

function isScored(o: Opportunity | ScoredOpportunity): o is ScoredOpportunity {
  return "score" in o;
}

export function OpportunityCard({
  opp,
}: {
  opp: Opportunity | ScoredOpportunity;
}) {
  const scored = isScored(opp);

  return (
    <article className="glass glass-hover edge-glow rounded-2xl p-6 flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-[0.68rem] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              TYPE_TINT[opp.type] ?? TYPE_TINT.certification
            }`}
          >
            {TYPE_LABELS[opp.type]}
          </span>
          {opp.remote && (
            <span className="text-[0.68rem] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/12 text-mist">
              Remote
            </span>
          )}
          {opp.capExempt && (
            <span className="text-[0.68rem] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/8 text-emerald-300">
              Cap-exempt
            </span>
          )}
        </div>

        {scored && (
          <div className="shrink-0 text-right">
            <div className="font-display text-2xl leading-none text-gradient">
              {fitPercent(opp.score)}%
            </div>
            <div className="text-[0.6rem] font-mono uppercase tracking-widest text-faint mt-1">
              fit
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-display text-2xl text-bone leading-tight">
          {opp.title}
        </h3>
        <p className="text-sm text-mist mt-1">
          {opp.org} · {opp.location}
        </p>
      </div>

      <p className="text-sm text-mist/90 leading-relaxed">{opp.description}</p>

      {scored && opp.reasons.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {opp.reasons.slice(0, 3).map((reason) => (
            <li
              key={reason}
              className="text-xs text-bone/75 flex items-start gap-2"
            >
              <span className="text-cyan-glow mt-0.5 shrink-0">→</span>
              {reason}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5">
        {opp.fields.slice(0, 3).map((f) => (
          <span
            key={f}
            className="text-[0.68rem] px-2 py-0.5 rounded-md bg-white/5 text-faint"
          >
            {FIELD_LABELS[f]}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/6 flex items-end justify-between gap-4">
        <div className="text-xs text-faint leading-relaxed">
          <div>{opp.commitment}</div>
          <div className="mt-0.5">
            Deadline: <span className="text-mist">{opp.deadline}</span>
          </div>
        </div>
        <a
          href={opp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm px-4 py-2 rounded-full border border-white/15 text-bone hover:bg-bone hover:text-void transition-colors"
        >
          Apply ↗
        </a>
      </div>

      <p className="text-[0.7rem] text-faint/80 italic leading-relaxed">
        {opp.eligibility}
      </p>
    </article>
  );
}
