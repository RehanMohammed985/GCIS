import type { Field, Opportunity } from "./types";

/**
 * Live opportunities for the H4 track.
 *
 * This track has no equivalent of an applicant-tracking system to poll — there
 * is no API for "unpaid research placements". What does exist are public APIs
 * for two categories that are unambiguously permissible on H4: volunteer
 * citizen-science projects, and open-source issues tagged for newcomers.
 * Neither involves compensation or an employer, which is exactly why they are
 * safe to surface here.
 *
 * Anything with a bounty, stipend or prize is out of scope by construction.
 */

const CACHE: NextFetchRequestConfig = {
  revalidate: 86400,
  tags: ["live-listings"],
};

/* --- Zooniverse ---------------------------------------------------------- */

type ZooProject = {
  id: string;
  display_name?: string;
  slug?: string;
  description?: string;
  redirect?: string;
};

// Zooniverse spans far more disciplines than its "space telescope" reputation
// suggests, so the subject areas are inferred from the project blurb.
const ZOO_HINTS: [RegExp, Field][] = [
  [/\b(galax|astro|star|planet|solar|cosmic|telescope|moon)\b/i, "physics"],
  [/\b(bird|animal|wildlife|species|penguin|whale|insect|primate)\b/i, "biology"],
  [/\b(climate|weather|ocean|forest|ecolog|habitat|conservat)\b/i, "environmental-science"],
  [/\b(cell|protein|genom|medical|cancer|disease|health)\b/i, "medicine"],
  [/\b(transcri|diary|letter|manuscript|archive|histor|document)\b/i, "writing"],
  [/\b(classif|annotat|label|data|machine learning)\b/i, "data-science"],
];

function zooFields(text: string): Field[] {
  const hits = ZOO_HINTS.filter(([re]) => re.test(text)).map(([, f]) => f);
  return hits.length > 0
    ? [...new Set(hits)]
    : ["data-science", "environmental-science"];
}

async function fetchZooniverse(): Promise<Opportunity[]> {
  const res = await fetch(
    "https://www.zooniverse.org/api/projects?cards=true&launch_approved=true&page_size=40&sort=-launch_date",
    { headers: { Accept: "application/vnd.api+json; version=1" }, next: CACHE },
  );
  if (!res.ok) throw new Error(`Zooniverse: HTTP ${res.status}`);

  const data = (await res.json()) as { projects?: ZooProject[] };
  return (data.projects ?? [])
    .filter((p) => p.display_name && p.slug && !p.redirect)
    .map((p) => {
      const blurb = (p.description ?? "").replace(/\s+/g, " ").trim();
      return {
        id: `live-zoo-${p.id}`,
        title: p.display_name!,
        org: "Zooniverse",
        type: "volunteer",
        visaTrack: "h4",
        paid: false,
        remote: true,
        location: "Remote",
        description: blurb
          ? blurb.slice(0, 220)
          : "An active citizen-science project where volunteer classifications feed real published research.",
        fields: zooFields(`${p.display_name} ${blurb}`),
        commitment: "Self-paced, any amount",
        deadline: "Rolling",
        url: `https://www.zooniverse.org/projects/${p.slug}`,
        eligibility:
          "Unpaid volunteer contribution to academic research with no compensation and no employment relationship.",
        gradeLevel: "high-school",
      } satisfies Opportunity;
    });
}

/* --- GitHub good-first-issue --------------------------------------------- */

/**
 * GitHub's search endpoints allow only 10 requests/minute unauthenticated, and
 * that budget is per-IP — which on Vercel is shared. A token raises it to 30
 * and makes the quota ours alone. Everything still works without one; the
 * source simply drops out of the corpus when the limit is hit, which
 * `Promise.allSettled` in fetchLiveH4 already absorbs.
 */
function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    // GitHub rejects unidentified clients on the search endpoints.
    "User-Agent": "gcis-opportunity-index",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

type GhRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description?: string | null;
  stargazers_count: number;
  pushed_at?: string;
};

const GH_LANGS: [string, Field[]][] = [
  ["python", ["computer-science", "data-science"]],
  ["javascript", ["computer-science", "design"]],
  ["typescript", ["computer-science"]],
];

/**
 * Surfaces well-known *projects* with newcomer-friendly issues, not individual
 * issues.
 *
 * Searching issues directly and sorting by recency returns whatever was filed
 * five minutes ago in a repository nobody has heard of — technically a "good
 * first issue", useless as a credential. Repository search supports a
 * `good-first-issues:>n` qualifier, so we can ask for established projects
 * that maintain a real on-ramp and link into their filtered issue list.
 */
async function fetchGitHubLang(
  lang: string,
  fields: Field[],
): Promise<Opportunity[]> {
  const q = encodeURIComponent(
    `good-first-issues:>5 stars:>3000 language:${lang} archived:false`,
  );
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=7`,
    { headers: githubHeaders(), next: CACHE },
  );
  if (!res.ok) throw new Error(`GitHub ${lang}: HTTP ${res.status}`);

  const data = (await res.json()) as { items?: GhRepo[] };
  return (data.items ?? []).map((repo) => {
    const stars =
      repo.stargazers_count >= 1000
        ? `${Math.round(repo.stargazers_count / 1000)}k`
        : String(repo.stargazers_count);
    const blurb = (repo.description ?? "").trim();

    return {
      id: `live-gh-${repo.id}`,
      title: `Contribute to ${repo.name}`,
      org: repo.full_name,
      type: "open-source",
      visaTrack: "h4",
      paid: false,
      remote: true,
      location: "Remote",
      description: `${blurb ? `${blurb.slice(0, 150)} ` : ""}A ${stars}-star ${lang} project maintaining a set of issues tagged for first-time contributors.`,
      fields,
      commitment: "Self-paced, 2-8 hrs per issue",
      deadline: "Rolling",
      url: `https://github.com/${repo.full_name}/issues?q=${encodeURIComponent('is:open is:issue label:"good first issue"')}`,
      eligibility:
        "Voluntary uncompensated contribution to public open-source software. No employer, no contract, no payment.",
      gradeLevel: "high-school",
      sourcedAt: repo.pushed_at,
    } satisfies Opportunity;
  });
}

/**
 * Fetches every H4 source, tolerating individual failures.
 *
 * GitHub's unauthenticated search endpoint is rate-limited to roughly 10
 * requests a minute, so the language queries are kept to three and everything
 * shares the daily cache tag.
 */
export async function fetchLiveH4(): Promise<Opportunity[]> {
  const tasks: Promise<Opportunity[]>[] = [
    fetchZooniverse(),
    ...GH_LANGS.map(([lang, fields]) => fetchGitHubLang(lang, fields)),
  ];

  const results = await Promise.allSettled(tasks);
  const ok = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  const seen = new Set<string>();
  return ok.filter((o) => !seen.has(o.url) && seen.add(o.url));
}
