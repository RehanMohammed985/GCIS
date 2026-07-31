# GCIS — Global Career Insight System

An index of opportunities that international students in the U.S. are
**actually eligible for**, built around the constraint every other job board
ignores: what you may accept depends on your visa.

| Track | Who | What it contains |
|---|---|---|
| **H4** | High school dependents, **no work authorization** | Unpaid research, volunteering, olympiads, open source, free certifications |
| **F1** | College students, CPT/OPT eligible | Internships, cap-exempt research institutions, sponsorship-friendly employers |

## Why the split matters

An H4 dependent cannot accept paid work of any kind, so the H4 track contains
no jobs at all — and every entry carries a one-line note explaining why the
activity is permissible. On the F1 side the hard part isn't finding
internships, it's finding ones that don't quietly require citizenship at the
offer stage.

The most useful work here was **deletion**. These are programs students are
routinely told to apply to, which bar student visas outright:

- **NIH SIP** — "you must be a U.S. citizen or permanent resident"
- **St. Jude POE** — "A student visa is not sufficient"
- **Amgen Scholars (US)** — U.S. citizens or permanent residents only
- **Harvard SHURP**, **Stanford SIMR/SSRP**, **Leadership Alliance SR-EIP**, **JAX SSP**

What survived names F-1 explicitly: MIT MSRP, Mayo Clinic SURF, CSHL URP,
Boston Children's, and Fred Hutch — whose FAQ contradicts the "citizens only"
line on its own landing page.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind v4
- **No database, no accounts** — profile and saved items live in `localStorage`
- Deploys to **Vercel** with no configuration

## Design

The visual model is a printed reference catalogue: newsprint stock, ink rules,
numbered entries, tabular metadata. Fraunces for display, Archivo for text, IBM
Plex Mono for every piece of metadata. No gradient meshes, no glassmorphism, no
blur — depth comes from rules, weight and spacing. Light and dark are both
first-class; the toggle persists and is applied before first paint to avoid a
flash.

## Data

Two layers, and the order is deliberate:

1. **Curated** — 81 hand-verified entries in `src/lib/data/`. Every URL was
   fetched and confirmed; every H4 entry confirmed unpaid.
2. **Live** — pulled daily from public feeds:
   - F1: ~23 public Greenhouse boards, filtered to US intern/new-grad roles
   - H4: Zooniverse citizen-science projects, and well-known GitHub projects
     that maintain good-first-issue on-ramps

Curated always renders first and is never replaced, so a total feed outage
degrades to "the site shows its verified index" rather than an empty page. Live
entries are labelled **Live** and explicitly marked as not visa-vetted.

### Implementation notes worth keeping

- **Greenhouse locations lie.** `location.name` is often `"In-Office"`; the real
  city lives in `offices`, which the API only returns with `content=true` — a
  response that reaches **12MB per board**, past Next's 2MB data-cache ceiling,
  so nothing would cache. We fetch the light list and spend a ~14KB per-job
  lookup only on placeholders. This matters: Cloudflare's "In-Office" interns
  are in **London**.
- **GitHub issue search is the wrong tool.** Sorting issues by recency returns
  whatever was filed in a repository nobody has heard of. Repository search
  supports `good-first-issues:>n`, so we surface established projects
  (PyTorch, vLLM) and link into their filtered issue list instead.
- **Matching uses hard filters, not score nudges.** Wrong track, zero subject
  overlap, and on-site-when-remote-only are all exclusions. An earlier version
  ranked these softly and every H4 entry "matched" every profile.

### The daily refresh

Vercel's Hobby plan caps cron at once per day, so `vercel.json` hits
`/api/cron/refresh` at 07:00 UTC to expire the `live-listings` cache tag.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build      # production build
npx tsc --noEmit   # typecheck
npx eslint src     # lint
```

## Deploying to Vercel

1. Push to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new) — the
   framework preset, build command and output are all detected automatically.
3. Deploy. Nothing else is required; the site works with zero env vars.

Optional environment variables:

| Variable | Effect if unset |
|---|---|
| `CRON_SECRET` | `/api/cron/refresh` accepts unauthenticated calls. Set it and Vercel signs cron invocations automatically. |
| `GITHUB_TOKEN` | GitHub search runs unauthenticated at 10 req/min per IP; the H4 open-source source drops out when throttled. A read-only token with no scopes is enough. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs and the sitemap fall back to `https://gcis.vercel.app`. Set to your real domain. |

## Layout

```
src/
  app/
    page.tsx                    cover
    start/                      3-step profile builder
    matches/                    ranked, explained results
    index-of-opportunities/     full corpus + faceted filters
    opportunity/[id]/           detail page per entry
    saved/                      bookmarks
    guide/                      visa rules, linked to official sources
    api/opportunities/          read-only JSON feed
    api/cron/refresh/           daily revalidation
  components/                   nav, footer, entry row, filters, theme
  lib/
    match.ts                    scoring + hard eligibility filters
    live.ts                     F1 applicant-tracking feeds
    liveH4.ts                   H4 volunteer + open-source feeds
    corpus.ts                   curated + live merge
    data/                       curated JSON
legacy-flask/                   original Flask scaffold, kept for reference
```

## Not legal advice

Immigration rules change and individual circumstances vary. Everything here is
informational — confirm your eligibility with your school's DSO or a licensed
immigration attorney before accepting any position, paid or unpaid.
