import {
  FIELD_LABELS,
  type Opportunity,
  type Profile,
  type ScoredOpportunity,
} from "./types";

/**
 * Scores an opportunity against a student profile.
 *
 * The ranking is intentionally explainable rather than clever: every point a
 * listing earns turns into a sentence shown on the card, so a student can see
 * why something surfaced. Field overlap dominates; the rest are tie-breakers.
 */
function scoreOne(opp: Opportunity, profile: Profile): ScoredOpportunity {
  const reasons: string[] = [];
  let score = 0;

  const overlap = opp.fields.filter((f) => profile.fields.includes(f));

  if (overlap.length > 0) {
    // Diminishing returns: the first match matters far more than the fourth.
    score += 50 + (overlap.length - 1) * 12;
    const named = overlap.slice(0, 2).map((f) => FIELD_LABELS[f]);
    reasons.push(
      profile.track === "f1"
        ? `Matches your major: ${named.join(" & ")}`
        : `Matches your interest in ${named.join(" & ")}`,
    );
  }

  if (opp.remote) {
    score += profile.remoteOnly ? 25 : 8;
    if (profile.remoteOnly) reasons.push("Fully remote, as you requested");
  }

  if (profile.track === "h4") {
    // For H4 the binding constraint is legality, not pay — surface it loudly.
    if (!opp.paid) {
      score += 15;
      reasons.push("No work authorization required");
    }
    if (opp.type === "research") {
      score += 12;
      reasons.push("Research experience strengthens college applications");
    }
    if (opp.type === "competition") {
      score += 8;
      reasons.push("Awards are a standout application credential");
    }
  }

  if (profile.track === "f1") {
    if (opp.capExempt) {
      score += 22;
      reasons.push("Cap-exempt employer — far better H-1B odds");
    } else if (opp.sponsorsVisa) {
      score += 16;
      reasons.push("Track record of sponsoring international students");
    }
    if (opp.type === "internship") {
      score += 10;
      reasons.push("Internship — CPT-eligible while you study");
    }
  }

  if (opp.deadline.toLowerCase() === "rolling") {
    score += 6;
    reasons.push("Rolling deadline — you can apply today");
  }

  return { ...opp, score, reasons };
}

/**
 * Returns opportunities relevant to the profile, best first.
 *
 * Three hard filters run before scoring, because each represents something the
 * student told us outright rather than a preference to trade off:
 *   - wrong visa track: showing an H4 high schooler a paid internship they
 *     legally cannot take is worse than showing them nothing;
 *   - no field overlap: the promise on every card is "matches your interest",
 *     so a listing that matches none of them has no business ranking at all;
 *   - remote-only: "I need to participate from home" is a constraint, not a
 *     nudge — an on-site lab in another state is useless to that student.
 */
export function matchOpportunities(
  all: Opportunity[],
  profile: Profile,
): ScoredOpportunity[] {
  return all
    .filter((opp) => opp.visaTrack === profile.track)
    .filter((opp) => opp.fields.some((f) => profile.fields.includes(f)))
    .filter((opp) => !profile.remoteOnly || opp.remote)
    .map((opp) => scoreOne(opp, profile))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

/** 0-100 fit percentage, for display only. */
export function fitPercent(score: number): number {
  return Math.min(99, Math.round((score / 110) * 100));
}
