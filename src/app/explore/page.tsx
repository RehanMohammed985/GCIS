import { getCorpus } from "@/lib/corpus";
import { ExploreView } from "./ExploreView";

export const metadata = {
  title: "Explore opportunities — GCIS",
};

// Re-rendered daily by the cron job; see src/app/api/cron/refresh.
export const revalidate = 86400;

export default async function ExplorePage() {
  const all = await getCorpus();
  return <ExploreView all={all} />;
}
