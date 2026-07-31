import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { OPPORTUNITIES } from "@/lib/data/opportunities";

const h4Count = OPPORTUNITIES.filter((o) => o.visaTrack === "h4").length;
const f1Count = OPPORTUNITIES.filter((o) => o.visaTrack === "f1").length;

const TRACKS = [
  {
    id: "h4",
    kicker: "H4 · High School",
    title: "You can't be paid.\nYou can still be\nundeniable.",
    body: "H4 dependents have no work authorization — so we skip jobs entirely. GCIS finds unpaid research, olympiads, open-source, and nonprofit work that builds a real record before college.",
    count: h4Count,
    accent: "from-amber-glow/20",
    href: "/start?track=h4",
  },
  {
    id: "f1",
    kicker: "F1 · College",
    title: "Sponsorship\nisn't a rumor.\nIt's a filter.",
    body: "Most listings never say whether they sponsor. GCIS ranks by what actually matters — cap-exempt employers, real sponsorship history, and CPT-eligible internships in your major.",
    count: f1Count,
    accent: "from-cyan-glow/20",
    href: "/start?track=f1",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Tell us your status",
    d: "H4 in high school, or F1 in college. This decides everything downstream — it is a legal boundary, not a preference.",
  },
  {
    n: "02",
    t: "Pick your direction",
    d: "College students choose a major. High schoolers choose interests. We match against both the field and the constraint.",
  },
  {
    n: "03",
    t: "Get a ranked, explained feed",
    d: "Every result shows why it surfaced and why you're allowed to take it. Refreshed daily.",
  },
];

export default function Home() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative mx-auto max-w-6xl px-6 pt-24 pb-32 sm:pt-36 sm:pb-40">
        <div className="rise">
          <p className="eyebrow mb-8">For international students in the U.S.</p>

          <h1 className="display text-[3.2rem] sm:text-[5.5rem] lg:text-[7rem] max-w-4xl">
            The opportunity
            <br />
            <span className="text-gradient">wasn&apos;t missing.</span>
            <br />
            The filter was.
          </h1>

          <p className="mt-10 text-lg sm:text-xl text-mist max-w-2xl leading-relaxed">
            Every job board assumes you can work. You can&apos;t — not the way
            they mean. GCIS is built around the constraint instead of ignoring
            it, matching H4 and F1 students to what they&apos;re actually
            eligible for.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/start"
              className="px-7 py-3.5 rounded-full bg-bone text-void font-medium hover:bg-white transition-all hover:scale-[1.03]"
            >
              Find my opportunities
            </Link>
            <Link
              href="/explore"
              className="px-7 py-3.5 rounded-full border border-white/15 text-bone hover:bg-white/5 transition-colors"
            >
              Browse everything
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 font-mono text-xs text-faint">
            <span>
              <span className="text-bone text-base">
                {OPPORTUNITIES.length}
              </span>{" "}
              curated opportunities
            </span>
            <span>
              <span className="text-bone text-base">2</span> visa tracks
            </span>
            <span>
              <span className="text-bone text-base">Daily</span> refresh
            </span>
          </div>
        </div>
      </section>

      {/* ---- Two tracks ---- */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="eyebrow mb-4">Two constraints, two products</p>
          <h2 className="display text-4xl sm:text-6xl max-w-3xl mb-16">
            Your visa decides what counts as an opportunity.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {TRACKS.map((track, i) => (
            <Reveal key={track.id} delay={i * 120}>
              <Link
                href={track.href}
                className={`group glass glass-hover edge-glow rounded-3xl p-8 sm:p-10 flex flex-col h-full bg-gradient-to-br ${track.accent} to-transparent`}
              >
                <p className="eyebrow mb-6">{track.kicker}</p>
                <h3 className="display text-3xl sm:text-4xl whitespace-pre-line mb-6">
                  {track.title}
                </h3>
                <p className="text-mist leading-relaxed mb-8">{track.body}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-mono text-xs text-faint">
                    {track.count} listings
                  </span>
                  <span className="text-bone group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="display text-4xl sm:text-6xl max-w-2xl mb-16">
            Three questions. Then a real answer.
          </h2>
        </Reveal>

        <div className="flex flex-col">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 100}>
              <div className="grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-12 py-10 border-t border-white/8">
                <span className="font-mono text-sm text-faint pt-2">
                  {step.n}
                </span>
                <div className="max-w-2xl">
                  <h3 className="font-display text-3xl mb-3">{step.t}</h3>
                  <p className="text-mist leading-relaxed">{step.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Close ---- */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="glass rounded-3xl p-10 sm:p-16 text-center">
            <h2 className="display text-4xl sm:text-6xl mb-6">
              Start where you actually stand.
            </h2>
            <p className="text-mist max-w-xl mx-auto mb-10 leading-relaxed">
              Two minutes of setup. No account, no email — your profile stays in
              your browser.
            </p>
            <Link
              href="/start"
              className="inline-block px-8 py-4 rounded-full bg-bone text-void font-medium hover:bg-white transition-all hover:scale-[1.03]"
            >
              Build my profile
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
