import { getCorpus } from "@/lib/corpus";
import { MatchesView } from "./MatchesView";

export const metadata = {
  title: "Your matches",
  description: "Opportunities ranked against your visa status and your field.",
};

export const revalidate = 86400;

export default async function MatchesPage() {
  const all = await getCorpus();
  return <MatchesView all={all} />;
}
