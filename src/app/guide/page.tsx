import { Reveal } from "@/components/Reveal";
import guidance from "@/lib/data/guidance.json";
import type { Guidance } from "@/lib/types";

export const metadata = {
  title: "The rules",
  description:
    "The work-authorization rules that decide which opportunities are open to you, each linked to its official source.",
};

const ITEMS = guidance as Guidance[];

const TRACK_LABEL = {
  h4: "H4 — dependent status",
  f1: "F1 — student status",
} as const;

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <header className="pt-14 pb-12 grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-x-12 gap-y-8">
        <div>
          <p className="label text-ink-faint mb-6">The rules</p>
          <h1 className="display text-[3rem] sm:text-[4.5rem] max-w-[12ch] mb-6">
            What you are allowed to do.
          </h1>
          <p className="text-ink-soft max-w-xl leading-relaxed">
            The short version of the rules that decide which opportunities are
            open to you. Each is linked to its official source — follow the link
            before you act on anything here.
          </p>
        </div>

        <aside className="lg:pt-2">
          <div className="border-l-2 border-flag pl-5 py-1">
            <p className="label text-flag mb-2">Read this first</p>
            <p className="text-sm text-ink-soft leading-relaxed">
              This is informational, not legal advice. Immigration rules change
              frequently and individual circumstances vary enormously. Your
              school&apos;s DSO is free, authoritative and far better placed to
              advise you than any website.
            </p>
          </div>
        </aside>
      </header>

      {(["h4", "f1"] as const).map((track) => {
        const items = ITEMS.filter((g) => g.track === track);
        if (items.length === 0) return null;

        return (
          <section key={track} className="pb-16">
            <Reveal>
              <p className="rule-head label text-ink-faint mb-8">
                <span className={track === "h4" ? "track-h4" : "track-f1"}>
                  {TRACK_LABEL[track]}
                </span>
              </p>
            </Reveal>

            <div className="rule-t">
              {items.map((item, i) => (
                <Reveal key={item.id} delay={Math.min(i, 4) * 60}>
                  <article className="py-8 rule-b grid lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-4">
                    <div className="hidden lg:block rail-num pt-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <h2 className="display-tight text-2xl sm:text-[1.75rem] mb-3 max-w-[22ch]">
                        {item.title}
                      </h2>
                      <p className="text-ink-soft leading-relaxed">
                        {item.summary}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label text-ink link-draw inline-block mt-5"
                      >
                        Official source ↗
                      </a>
                    </div>

                    <ul className="flex flex-col gap-2.5">
                      {item.details.map((d) => (
                        <li
                          key={d}
                          className="text-sm leading-relaxed flex gap-3"
                        >
                          <span className="text-ink-faint num shrink-0">—</span>
                          <span className="text-ink-soft">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
