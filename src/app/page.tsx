import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { OPPORTUNITIES } from "@/lib/data/opportunities";
import { FIELD_LABELS, type Field } from "@/lib/types";

const h4 = OPPORTUNITIES.filter((o) => o.visaTrack === "h4");
const f1 = OPPORTUNITIES.filter((o) => o.visaTrack === "f1");

// Computed at build so the cover always states the real size of the index.
const FIELD_COUNTS = Object.entries(
  OPPORTUNITIES.reduce<Record<string, number>>((acc, o) => {
    for (const f of o.fields) acc[f] = (acc[f] ?? 0) + 1;
    return acc;
  }, {}),
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

const EXCLUDED = [
  ["NIH Summer Internship", "you must be a U.S. citizen or permanent resident"],
  ["St. Jude POE", "a student visa is not sufficient"],
  ["Amgen Scholars (US)", "U.S. citizens or U.S. permanent residents"],
  ["Harvard SHURP", "open only to U.S. citizens or permanent residents"],
  ["Leadership Alliance", "F-1 visa holders are not eligible"],
];

export default function Home() {
  return (
    <>
      {/* ---- Cover ---- */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-x-12 gap-y-10 pt-14 pb-20 sm:pt-20">
          <div>
            <p className="label text-ink-faint mb-8">
              For international students in the United States
            </p>

            <h1 className="display text-[3.4rem] sm:text-[5.5rem] xl:text-[6.8rem] max-w-[14ch]">
              An index of what you can{" "}
              <span className="text-accent italic">actually</span> take.
            </h1>

            <p className="mt-9 text-lg sm:text-xl text-ink-soft max-w-xl leading-relaxed">
              Every job board assumes you can work. On H4 you can&apos;t — and on
              F1 only under conditions most listings never mention. This is the
              index built the other way round: eligibility first, everything
              else after.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/start" className="btn">
                Build your profile
              </Link>
              <Link href="/index-of-opportunities" className="btn btn-ghost">
                Read the index
              </Link>
            </div>
          </div>

          {/* Masthead-style stat block. */}
          <aside className="lg:pt-2">
            <div className="rule-heavy pt-4">
              <dl className="flex flex-col">
                {[
                  ["Verified entries", String(OPPORTUNITIES.length)],
                  ["H4 — no work authorization", String(h4.length)],
                  ["F1 — CPT / OPT eligible", String(f1.length)],
                  ["Cap-exempt employers", String(f1.filter((o) => o.capExempt).length)],
                  ["Refreshed", "Daily"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 py-3 rule-b"
                  >
                    <dt className="label text-ink-faint">{k}</dt>
                    <dd className="num text-xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* ---- The two tracks ---- */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16">
        <Reveal>
          <p className="rule-head label text-ink-faint mb-10">
            <span>01 — Two tracks</span>
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-px bg-rule">
          {[
            {
              id: "h4",
              tag: "H4 · Dependent · High school",
              head: "You cannot be paid.",
              body: "H4 carries no work authorization, so this track contains no jobs at all. What it contains is the record that gets you into a good school: mentored research, olympiads, open-source commits, and real nonprofit work. Every entry states why it is permissible.",
              count: h4.length,
              bar: "bar-h4",
              href: "/start?track=h4",
            },
            {
              id: "f1",
              tag: "F1 · Student · College",
              head: "You need someone who sponsors.",
              body: "Finding an internship is easy. Finding one that will not quietly require citizenship at the offer stage is the hard part. This track ranks cap-exempt institutions first, because they skip the H-1B lottery entirely, and flags every sponsorship claim we could not verify.",
              count: f1.length,
              bar: "bar-f1",
              href: "/start?track=f1",
            },
          ].map((track, i) => (
            <Reveal key={track.id} delay={i * 90}>
              <Link
                href={track.href}
                className="group block bg-paper hover:bg-paper-raised transition-colors p-8 sm:p-12 h-full"
              >
                <div className={`h-1 w-16 mb-8 ${track.bar}`} />
                <p className="label text-ink-faint mb-5">{track.tag}</p>
                <h2 className="display text-4xl sm:text-5xl mb-6 max-w-[16ch]">
                  {track.head}
                </h2>
                <p className="text-ink-soft leading-relaxed max-w-lg mb-8">
                  {track.body}
                </p>
                <p className="label text-ink flex items-center gap-2">
                  <span className="num">{track.count}</span> entries
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- What we threw out ---- */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16">
        <Reveal>
          <p className="rule-head label text-ink-faint mb-10">
            <span>02 — What we removed</span>
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-x-14 gap-y-10">
          <Reveal>
            <h2 className="display text-4xl sm:text-5xl mb-6 max-w-[15ch]">
              The useful work was deletion.
            </h2>
            <p className="text-ink-soft leading-relaxed max-w-md">
              Every entry&apos;s eligibility page was read before it was
              listed. These are programs students are routinely told to apply
              to, which turn out to bar student visas outright. They are not in
              the index — and knowing that is worth as much as any listing in
              it.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <ul>
              {EXCLUDED.map(([name, quote], i) => (
                <li
                  key={name}
                  className={`py-4 rule-b flex flex-col sm:flex-row sm:items-baseline gap-x-6 gap-y-1 ${i === 0 ? "rule-t" : ""}`}
                >
                  <span className="display-tight text-lg shrink-0 sm:w-56 line-through decoration-accent decoration-2">
                    {name}
                  </span>
                  <span className="text-sm text-ink-soft italic">
                    &ldquo;{quote}&rdquo;
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---- Fields ---- */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16">
        <Reveal>
          <p className="rule-head label text-ink-faint mb-10">
            <span>03 — By subject</span>
          </p>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap gap-x-8 gap-y-4 items-baseline">
            {FIELD_COUNTS.map(([field, count]) => (
              <Link
                key={field}
                href={`/index-of-opportunities?field=${field}`}
                className="group flex items-baseline gap-2"
              >
                <span className="display-tight text-2xl sm:text-4xl link-draw">
                  {FIELD_LABELS[field as Field]}
                </span>
                <span className="num text-sm text-ink-faint">{count}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---- Close ---- */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-20">
        <Reveal>
          <div className="rule-heavy pt-10 grid lg:grid-cols-[minmax(0,1fr)_auto] gap-8 items-end">
            <div>
              <h2 className="display text-4xl sm:text-6xl max-w-[16ch] mb-5">
                Start from where you actually stand.
              </h2>
              <p className="text-ink-soft max-w-lg leading-relaxed">
                Three questions, no account, no email. Your profile stays in
                your browser and never reaches a server.
              </p>
            </div>
            <Link href="/start" className="btn shrink-0">
              Begin
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
