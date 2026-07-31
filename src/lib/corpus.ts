import { OPPORTUNITIES } from "./data/opportunities";
import { fetchLiveListings } from "./live";
import type { Opportunity } from "./types";

/**
 * The full corpus a page should render: hand-verified listings plus whatever
 * the live feeds returned.
 *
 * Curated always comes first and is never replaced, so a total feed outage
 * degrades to "the site shows 53 verified opportunities" rather than an empty
 * page.
 */
export async function getCorpus(): Promise<Opportunity[]> {
  try {
    const live = await fetchLiveListings();
    return [...OPPORTUNITIES, ...live];
  } catch {
    return OPPORTUNITIES;
  }
}
