import { revalidateTag } from "next/cache";
import { fetchLiveListings } from "@/lib/live";

/**
 * Daily refresh of the live listing feeds.
 *
 * Vercel's Hobby plan caps cron at once per day, so this runs on a daily
 * schedule (see vercel.json) rather than the more frequent poll a paid plan
 * would allow. Internship postings move on a weekly-to-monthly cadence, so a
 * daily sweep loses very little.
 */
export async function GET(request: Request) {
  // Vercel signs cron invocations with CRON_SECRET. Reject anything else so
  // the endpoint can't be used to hammer the upstream boards.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  // Next 16 requires a cacheLife profile; "max" is right here because a daily
  // sweep of job postings tolerates stale-while-revalidate fine.
  revalidateTag("live-listings", "max");

  try {
    const listings = await fetchLiveListings();
    return Response.json({
      ok: true,
      refreshedAt: new Date().toISOString(),
      liveCount: listings.length,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown" },
      { status: 500 },
    );
  }
}
