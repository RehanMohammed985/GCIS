import { getCorpus } from "@/lib/corpus";
import { SavedView } from "./SavedView";

export const metadata = {
  title: "Saved",
  description: "Opportunities you've set aside.",
};

export const revalidate = 86400;

export default async function SavedPage() {
  const all = await getCorpus();
  return <SavedView all={all} />;
}
