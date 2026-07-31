import { getCorpus } from "@/lib/corpus";

/** Read-only feed of the whole corpus, filterable by track and field. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track");
  const field = searchParams.get("field");

  let items = await getCorpus();

  if (track === "h4" || track === "f1") {
    items = items.filter((o) => o.visaTrack === track);
  }
  if (field) {
    items = items.filter((o) => o.fields.includes(field as never));
  }

  return Response.json({ count: items.length, items });
}
