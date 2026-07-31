import { OPPORTUNITIES } from "./data/opportunities";
import { fetchLiveListings } from "./live";
import { fetchLiveH4 } from "./liveH4";
import type { Opportunity } from "./types";

/**
 * The full corpus a page should render: hand-verified listings first, then
 * whatever the live feeds returned.
 *
 * Curated is never replaced, so a total feed outage degrades to "the site
 * shows its verified index" rather than an empty page. Each track is settled
 * independently — a GitHub rate-limit must not take the F1 internships down
 * with it.
 */
export async function getCorpus(): Promise<Opportunity[]> {
  const [f1, h4] = await Promise.allSettled([
    fetchLiveListings(),
    fetchLiveH4(),
  ]);

  return [
    ...OPPORTUNITIES,
    ...(f1.status === "fulfilled" ? f1.value : []),
    ...(h4.status === "fulfilled" ? h4.value : []),
  ];
}

export async function getById(id: string): Promise<Opportunity | null> {
  const all = await getCorpus();
  return all.find((o) => o.id === id) ?? null;
}
