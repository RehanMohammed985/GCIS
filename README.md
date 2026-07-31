# GCIS — Global Career Insight System

Opportunity matching for international students in the U.S., built around the
constraint every other job board ignores: **what you're legally allowed to
accept depends on your visa.**

Two tracks, because they are genuinely different products:

| Track | Who | What we surface |
|---|---|---|
| **H4** | High school dependents, **no work authorization** | Unpaid research, volunteering, olympiads, open source, free certifications |
| **F1** | College students, CPT/OPT eligible | Internships, cap-exempt research institutions, sponsorship-friendly employers |

## Why the split matters

An H4 dependent cannot accept paid work of any kind. Showing them a paid
internship isn't merely unhelpful — acting on it can jeopardise their status.
So H4 listings are filtered to genuinely unpaid activity, and every card
carries a one-line note explaining *why* it's permissible.

On the F1 side the hard part isn't finding internships, it's finding ones that
don't quietly require citizenship. Several household-name programs were
**deliberately excluded** after their eligibility pages turned out to bar
student visas outright:

- **NIH SIP** — "you must be a U.S. citizen or permanent resident"
- **St. Jude POE** — "A student visa is not sufficient"
- **Amgen Scholars (US)** — U.S. citizens or permanent residents only
- **Harvard SHURP**, **Stanford SIMR/SSRP**, **Leadership Alliance SR-EIP**, **JAX SSP**

What survived is programs that name F-1 explicitly, like MIT MSRP, Mayo Clinic
SURF, CSHL URP, Fred Hutch SURP (whose FAQ overrides a misleading "citizens
only" line on its own landing page), and Boston Children's.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind v4
- **No database and no accounts** — the profile lives in `localStorage`
- Deploys to **Vercel** as-is

## Data

Two layers, and the ordering is deliberate:

1. **Curated** (`src/lib/data/h4.json`, `f1.json`) — 53 hand-verified entries.
   Every URL was fetched and confirmed; every H4 entry confirmed unpaid.
2. **Live** (`src/lib/live.ts`) — internship postings pulled from ~23 public
   Greenhouse feeds, filtered to US-based intern/new-grad roles.

Curated always renders first and is never replaced, so a total feed outage
degrades to "53 verified opportunities" rather than an empty page. Live
postings are explicitly labelled as **not** visa-vetted.

### The daily refresh

Vercel's Hobby plan caps cron at **once per day**, so `vercel.json` schedules
`/api/cron/refresh` at 07:00 UTC to expire the `live-listings` cache tag.

Two implementation notes worth keeping:

- Greenhouse only returns the `offices` field (the *real* location) when asked
  for job content — but that response runs up to **12MB per board**, past
  Next's 2MB data-cache ceiling, so nothing would cache. We fetch the light
  list instead and spend a ~14KB per-job lookup only on postings whose
  location is a placeholder like `"In-Office"`.
- That placeholder matters: Cloudflare's "In-Office" internships are actually
  in **London**, and the naive filter kept them.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build      # production build
npx tsc --noEmit   # typecheck
```

## Deploying

Import the repo on Vercel; the defaults are correct. Optionally set
`CRON_SECRET` — when present, `/api/cron/refresh` requires
`Authorization: Bearer <secret>`, which Vercel sends automatically.

## Layout

```
src/
  app/
    page.tsx              landing
    start/                3-step profile builder
    dashboard/            ranked, explained matches
    explore/              full corpus + filters
    guide/                visa rules, linked to official sources
    api/opportunities/    read-only JSON feed
    api/cron/refresh/     daily revalidation
  components/             SiteNav, OpportunityCard, Reveal
  lib/
    match.ts              scoring + hard eligibility filters
    live.ts               ATS feed adapters
    corpus.ts             curated + live merge
    data/                 curated JSON
legacy-flask/             original Flask scaffold, kept for reference
```

## Not legal advice

Immigration rules change and individual circumstances vary. Everything here is
informational — confirm your eligibility with your DSO or an immigration
attorney before accepting any position, paid or unpaid.
