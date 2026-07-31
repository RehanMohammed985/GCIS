import type { Field, Opportunity } from "./types";

/**
 * Live internship listings pulled from public applicant-tracking-system feeds.
 *
 * These are the vendors' own public JSON endpoints — the same data their
 * hosted careers pages render — not scraped HTML, so they are stable and
 * intended for consumption.
 *
 * Deliberately conservative on visa claims: we do NOT assert that any of these
 * employers sponsor. A posting only reaches a student with a note telling them
 * to confirm sponsorship on the posting itself.
 */

type Source = { token: string; org: string; ats: "greenhouse" | "lever" };

// Companies with public boards that run large, well-known intern programs.
// Every token below was verified by fetching its feed and confirming a 200.
// Chosen for field breadth, not just software: Figma covers design, Affirm /
// Coinbase / Robinhood / SoFi / Chime cover finance, Databricks / Datadog /
// Scale cover data.
const SOURCES: Source[] = [
  { token: "stripe", org: "Stripe", ats: "greenhouse" },
  { token: "databricks", org: "Databricks", ats: "greenhouse" },
  { token: "figma", org: "Figma", ats: "greenhouse" },
  { token: "robinhood", org: "Robinhood", ats: "greenhouse" },
  { token: "airtable", org: "Airtable", ats: "greenhouse" },
  { token: "discord", org: "Discord", ats: "greenhouse" },
  { token: "cloudflare", org: "Cloudflare", ats: "greenhouse" },
  { token: "anthropic", org: "Anthropic", ats: "greenhouse" },
  { token: "flexport", org: "Flexport", ats: "greenhouse" },
  { token: "scaleai", org: "Scale AI", ats: "greenhouse" },
  { token: "samsara", org: "Samsara", ats: "greenhouse" },
  { token: "affirm", org: "Affirm", ats: "greenhouse" },
  { token: "coinbase", org: "Coinbase", ats: "greenhouse" },
  { token: "asana", org: "Asana", ats: "greenhouse" },
  { token: "pinterest", org: "Pinterest", ats: "greenhouse" },
  { token: "instacart", org: "Instacart", ats: "greenhouse" },
  { token: "datadog", org: "Datadog", ats: "greenhouse" },
  { token: "reddit", org: "Reddit", ats: "greenhouse" },
  { token: "twilio", org: "Twilio", ats: "greenhouse" },
  { token: "gitlab", org: "GitLab", ats: "greenhouse" },
  { token: "sofi", org: "SoFi", ats: "greenhouse" },
  { token: "chime", org: "Chime", ats: "greenhouse" },
  { token: "vercel", org: "Vercel", ats: "greenhouse" },
];

const INTERN_RE = /\b(intern|internship|co-?op|new grad|university grad)\b/i;

/** Keyword → field mapping, longest-match-wins via ordering. */
const FIELD_HINTS: [RegExp, Field][] = [
  [/\b(machine learning|ml|ai|data scien|analytics)\b/i, "data-science"],
  [/\b(software|engineer|developer|backend|frontend|full.?stack|infra)\b/i, "computer-science"],
  [/\b(security|systems|hardware|network)\b/i, "engineering"],
  [/\b(design|ux|ui|product design|brand)\b/i, "design"],
  [/\b(finance|accounting|treasury|audit)\b/i, "finance"],
  [/\b(market|sales|business|strategy|operations|bizops)\b/i, "business"],
  [/\b(econom)\b/i, "economics"],
  [/\b(legal|counsel|compliance)\b/i, "law"],
  [/\b(writer|content|communications)\b/i, "writing"],
];

function inferFields(title: string): Field[] {
  const hits = FIELD_HINTS.filter(([re]) => re.test(title)).map(([, f]) => f);
  // Everything on these boards is a tech company; default to CS so a listing
  // is never left with zero fields (which would make it unmatchable).
  return hits.length > 0 ? [...new Set(hits)] : ["computer-science"];
}

// Full names and postal codes, because boards are wildly inconsistent —
// Databricks writes "Bellevue, Washington" where Scale writes "New York, NY".
const US_STATES =
  "alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming";
const US_CODES =
  "al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy|dc";

const US_RE = new RegExp(
  `\\b(usa|u\\.s\\.a?|united states|${US_STATES}|${US_CODES})\\b`,
  "i",
);

// Checked first — "Remote, Canada" and "London, United Kingdom" must lose even
// though a naive scan would find no US token to reject them on.
const NON_US_RE =
  /\b(canada|toronto|vancouver|montreal|mexico|india|bengaluru|bangalore|hyderabad|pune|united kingdom|uk|london|ireland|dublin|germany|berlin|munich|france|paris|netherlands|amsterdam|spain|madrid|portugal|lisbon|poland|warsaw|singapore|japan|tokyo|australia|sydney|melbourne|brazil|sao paulo|china|shanghai|beijing|korea|seoul|israel|tel aviv|emea|apac|latam)\b/i;

/**
 * Decides whether a posting is US-based.
 *
 * `location.name` is frequently useless ("In-Office", "Phillipsburg
 * Warehouse"), so the caller folds the `offices` entries into this string
 * too — that is where Greenhouse keeps the real city for those boards.
 * Ambiguous postings are dropped rather than guessed: an F1 student cannot
 * use a London internship, and a wrong inclusion wastes their time.
 */
function isUS(location: string): boolean {
  if (!location) return false;
  if (NON_US_RE.test(location)) return false;
  if (US_RE.test(location)) return true;
  // "Remote" with no country qualifier, on a US-headquartered board.
  return /\bremote\b/i.test(location);
}

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  location?: { name?: string };
  offices?: { name?: string; location?: string }[];
};

type LeverJob = {
  id: string;
  text: string;
  hostedUrl: string;
  categories?: { location?: string };
};

// One refresh a day is all the Vercel Hobby cron allows, and it is plenty for
// internship postings. The tag lets the cron route expire every feed at once.
const CACHE: NextFetchRequestConfig = {
  revalidate: 86400,
  tags: ["live-listings"],
};

/** True when the string tells us nothing either way about the country. */
function isAmbiguous(location: string): boolean {
  return !US_RE.test(location) && !NON_US_RE.test(location);
}

/**
 * Resolves a placeholder location via the single-job endpoint.
 *
 * Greenhouse only returns `offices` when asked for job content, and the
 * whole-board version of that is up to 12MB — far past Next's 2MB data-cache
 * ceiling, so nothing would cache and every rebuild would re-pull ~80MB. The
 * per-job endpoint carries the same `offices` in ~14KB, so we spend it only
 * on the handful of postings whose location is actually unreadable.
 */
async function resolveOffices(token: string, id: number): Promise<string> {
  try {
    const res = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${token}/jobs/${id}`,
      { next: CACHE },
    );
    if (!res.ok) return "";
    const job = (await res.json()) as GreenhouseJob;
    return (job.offices ?? [])
      .map((o) => o.location || o.name || "")
      .filter(Boolean)
      .join("; ");
  } catch {
    return "";
  }
}

// Bounds the per-job lookups for a board whose locations are all placeholders,
// so one badly-configured source can't fan out into hundreds of requests.
const MAX_LOOKUPS_PER_SOURCE = 25;

async function fetchSource(src: Source): Promise<Opportunity[]> {
  const url =
    src.ats === "greenhouse"
      ? `https://boards-api.greenhouse.io/v1/boards/${src.token}/jobs`
      : `https://api.lever.co/v0/postings/${src.token}?mode=json`;

  const res = await fetch(url, { next: CACHE });
  if (!res.ok) throw new Error(`${src.org}: HTTP ${res.status}`);

  const raw: unknown = await res.json();
  const jobs =
    src.ats === "greenhouse"
      ? ((raw as { jobs?: GreenhouseJob[] }).jobs ?? [])
      : (raw as LeverJob[]);

  const candidates = (jobs as (GreenhouseJob & LeverJob)[])
    .map((j) => ({
      j,
      title: src.ats === "greenhouse" ? j.title : j.text,
      stated:
        (src.ats === "greenhouse" ? j.location?.name : j.categories?.location) ??
        "",
    }))
    .filter(({ title }) => INTERN_RE.test(title));

  let lookups = 0;
  const resolved = await Promise.all(
    candidates.map(async (c) => {
      let location = c.stated;
      if (
        src.ats === "greenhouse" &&
        isAmbiguous(location) &&
        lookups < MAX_LOOKUPS_PER_SOURCE
      ) {
        lookups += 1;
        const offices = await resolveOffices(src.token, c.j.id);
        if (offices) location = offices;
      }
      return { ...c, location };
    }),
  );

  return resolved
    .filter(({ location }) => isUS(location))
    .map(({ j, title, location }) => {
      const remote = /remote/i.test(location);
      return {
        id: `live-${src.ats}-${src.token}-${j.id}`,
        title,
        org: src.org,
        type: "internship",
        visaTrack: "f1",
        paid: true,
        remote,
        location: location || "United States",
        description: `Open ${title} posting at ${src.org}, pulled live from their careers feed.`,
        fields: inferFields(title),
        commitment: "Varies — see posting",
        deadline: "Rolling",
        url: src.ats === "greenhouse" ? j.absolute_url : j.hostedUrl,
        eligibility:
          "Live posting, not visa-vetted by GCIS. Confirm sponsorship and work-authorization requirements on the posting before applying.",
        sponsorsVisa: false,
        capExempt: false,
        gradeLevel: "college",
        sourcedAt: j.updated_at,
      } satisfies Opportunity;
    });
}

/**
 * Fetches every source, tolerating individual failures.
 *
 * A dead board must never take down the page, so failures are swallowed per
 * source and the caller merges whatever came back on top of the curated set.
 */
export async function fetchLiveListings(): Promise<Opportunity[]> {
  const results = await Promise.allSettled(SOURCES.map(fetchSource));
  const ok = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  // Dedup by URL — the same req occasionally appears under two board slugs.
  const seen = new Set<string>();
  return ok.filter((o) => !seen.has(o.url) && seen.add(o.url));
}
