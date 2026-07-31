import Link from "next/link";
import { notFound } from "next/navigation";
import { getById, getCorpus } from "@/lib/corpus";
import { OPPORTUNITIES } from "@/lib/data/opportunities";
import { SaveButton } from "@/components/SaveButton";
import { EntryRow } from "@/components/EntryRow";
import { FIELD_LABELS, TYPE_LABELS } from "@/lib/types";

export const revalidate = 86400;

/**
 * Pre-renders the curated entries only.
 *
 * Live listings churn daily and are reachable through the same route on
 * demand, so baking their ids into the build would just produce stale pages.
 */
export async function generateStaticParams() {
  return OPPORTUNITIES.map((o) => ({ id: o.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const opp = await getById(decodeURIComponent(id));
  if (!opp) return { title: "Not found" };
  return {
    title: `${opp.title} — ${opp.org}`,
    description: opp.description,
  };
}

export default async function OpportunityPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const decoded = decodeURIComponent(id);
  const [opp, all] = await Promise.all([getById(decoded), getCorpus()]);

  if (!opp) notFound();

  const related = all
    .filter(
      (o) =>
        o.id !== opp.id &&
        o.visaTrack === opp.visaTrack &&
        o.fields.some((f) => opp.fields.includes(f)),
    )
    .slice(0, 4);

  const isLive = opp.id.startsWith("live-");

  return (
    <article className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <nav className="pt-8 pb-10">
        <Link href="/index-of-opportunities" className="label text-ink-faint link-draw">
          ← Back to the index
        </Link>
      </nav>

      <header className="grid lg:grid-cols-[minmax(0,1fr)_18rem] gap-x-12 gap-y-8 pb-12 rule-b">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
            <span
              className={`label ${opp.visaTrack === "h4" ? "track-h4" : "track-f1"}`}
            >
              {opp.visaTrack.toUpperCase()}
            </span>
            <span className="label text-ink-faint">{TYPE_LABELS[opp.type]}</span>
            {opp.capExempt && (
              <span className="label text-accent-2">Cap-exempt</span>
            )}
            {isLive && (
              <span className="label text-ink-faint border border-rule px-1.5">
                Live listing
              </span>
            )}
          </div>

          <h1 className="display text-[2.6rem] sm:text-[4rem] max-w-[16ch] mb-5">
            {opp.title}
          </h1>

          <p className="text-lg text-ink-soft">
            {opp.org} — {opp.location}
          </p>

          <p className="mt-8 text-lg leading-relaxed max-w-2xl">
            {opp.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={opp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Open the application ↗
            </a>
            <SaveButton id={opp.id} />
          </div>
        </div>

        <aside>
          <dl className="rule-heavy pt-4">
            {[
              ["Kind", TYPE_LABELS[opp.type]],
              ["Compensation", opp.paid ? "Paid" : "Unpaid"],
              ["Format", opp.remote ? "Remote" : "On site"],
              ["Commitment", opp.commitment],
              ["Deadline", opp.deadline],
              [
                "Level",
                opp.gradeLevel === "high-school" ? "High school" : "College",
              ],
            ].map(([k, v]) => (
              <div key={k} className="py-3 rule-b">
                <dt className="label text-ink-faint mb-1">{k}</dt>
                <dd className="text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </header>

      {/* Eligibility is the whole point of the product, so it gets the most
          prominent block on the page rather than a footnote on a card. */}
      <section className="py-12 grid lg:grid-cols-[minmax(0,1fr)_18rem] gap-x-12 gap-y-8">
        <div>
          <p className="rule-head label text-ink-faint mb-6">
            <span>Why you can take this</span>
          </p>
          <p className="display-tight text-2xl sm:text-[1.75rem] leading-snug max-w-3xl">
            {opp.eligibility}
          </p>

          {isLive && (
            <p className="mt-8 text-sm text-ink-soft border-l-2 border-flag pl-4 max-w-2xl leading-relaxed">
              This entry came from a public job feed and was not individually
              checked by us. Read the posting&apos;s own work-authorization
              requirements before you invest time in an application.
            </p>
          )}

          <p className="mt-8 text-sm text-ink-faint max-w-2xl leading-relaxed">
            Not legal advice. Confirm with your school&apos;s DSO or an
            immigration attorney before accepting any position.
          </p>
        </div>

        <div>
          <p className="label text-ink-faint mb-4">Subjects</p>
          <ul className="flex flex-col">
            {opp.fields.map((f) => (
              <li key={f} className="py-2 rule-b">
                <Link
                  href={`/index-of-opportunities?field=${f}`}
                  className="text-sm link-draw"
                >
                  {FIELD_LABELS[f]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12">
          <p className="rule-head label text-ink-faint mb-6">
            <span>Related on this track</span>
          </p>
          <div className="rule-t">
            {related.map((r, i) => (
              <EntryRow key={r.id} opp={r} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
