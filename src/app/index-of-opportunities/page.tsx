import { getCorpus } from "@/lib/corpus";
import { IndexView } from "./IndexView";

export const metadata = {
  title: "The index",
  description:
    "Every verified opportunity in GCIS, filterable by visa track, subject and type.",
};

// Rebuilt daily by the cron job; see src/app/api/cron/refresh.
export const revalidate = 86400;

export default async function IndexPage(props: {
  searchParams: Promise<{ field?: string; track?: string }>;
}) {
  const [all, params] = await Promise.all([getCorpus(), props.searchParams]);

  return (
    <IndexView
      all={all}
      initialField={params.field}
      initialTrack={params.track}
    />
  );
}
