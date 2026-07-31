import { Reveal } from "@/components/Reveal";
import guidance from "@/lib/data/guidance.json";
import type { Guidance } from "@/lib/types";

export const metadata = {
  title: "Visa guide — GCIS",
};

const ITEMS = guidance as Guidance[];

const TRACK_LABEL = {
  h4: "H4 · High school",
  f1: "F1 · College",
} as const;

export default function GuidePage() {
  const tracks = ["h4", "f1"] as const;

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="rise mb-16">
        <p className="eyebrow mb-5">The rules, plainly</p>
        <h1 className="display text-5xl sm:text-7xl mb-6">
          What you&apos;re
          <br />
          <span className="text-gradient">actually allowed</span>
          <br />
          to do.
        </h1>
        <p className="text-mist max-w-xl leading-relaxed">
          The short version of the rules that decide which opportunities are
          open to you — each linked to the official source.
        </p>
      </div>

      {tracks.map((track) => {
        const items = ITEMS.filter((g) => g.track === track);
        if (items.length === 0) return null;

        return (
          <section key={track} className="mb-20">
            <Reveal>
              <h2 className="eyebrow mb-8 pb-4 border-b border-white/8">
                {TRACK_LABEL[track]}
              </h2>
            </Reveal>

            <div className="flex flex-col gap-4">
              {items.map((item, i) => (
                <Reveal key={item.id} delay={i * 70}>
                  <article className="glass glass-hover rounded-2xl p-7">
                    <h3 className="font-display text-2xl mb-3">{item.title}</h3>
                    <p className="text-mist leading-relaxed mb-5">
                      {item.summary}
                    </p>
                    <ul className="flex flex-col gap-2 mb-5">
                      {item.details.map((d) => (
                        <li
                          key={d}
                          className="text-sm text-bone/75 flex items-start gap-2.5 leading-relaxed"
                        >
                          <span className="text-cyan-glow mt-1 shrink-0">
                            ▸
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-glow hover:underline"
                    >
                      Official source ↗
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}

      <Reveal>
        <div className="glass rounded-2xl p-7 border-amber-glow/25 bg-amber-glow/5">
          <h3 className="font-display text-xl mb-2 text-amber-glow">
            This is not legal advice
          </h3>
          <p className="text-sm text-mist leading-relaxed">
            Immigration rules change and individual circumstances vary enormously.
            Confirm anything here with your school&apos;s DSO or a licensed
            immigration attorney before you act on it — especially before
            accepting any position, paid or unpaid.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
