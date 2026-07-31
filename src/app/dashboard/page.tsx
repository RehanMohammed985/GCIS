import { getCorpus } from "@/lib/corpus";
import { DashboardView } from "./DashboardView";

export const metadata = {
  title: "My matches — GCIS",
};

// Re-rendered daily by the cron job; see src/app/api/cron/refresh.
export const revalidate = 86400;

export default async function DashboardPage() {
  const all = await getCorpus();
  return <DashboardView all={all} />;
}
