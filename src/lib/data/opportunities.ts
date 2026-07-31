import type { Opportunity } from "../types";
import h4 from "./h4.json";
import f1 from "./f1.json";

/**
 * The opportunity corpus.
 *
 * Both files are hand-verified: every entry was checked to exist, and every
 * entry was checked against the eligibility rules of its track — H4 listings
 * are confirmed unpaid, F1 listings are confirmed open to student-visa
 * holders. Several well-known programs (NIH SIP, Amgen Scholars, JAX SSP)
 * were deliberately excluded after their pages turned out to require US
 * citizenship or permanent residency.
 *
 * The daily refresh job appends discovered listings on top of this base
 * rather than replacing it, so a failed refresh can never empty the site.
 */
export const OPPORTUNITIES = [
  ...(h4 as Opportunity[]),
  ...(f1 as Opportunity[]),
];

export function byTrack(track: "h4" | "f1") {
  return OPPORTUNITIES.filter((o) => o.visaTrack === track);
}

export function byId(id: string) {
  return OPPORTUNITIES.find((o) => o.id === id) ?? null;
}
