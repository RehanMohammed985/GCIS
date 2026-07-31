import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-28 rule-t">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 grid gap-10 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="display-tight text-2xl mb-3">GCIS</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            An index of opportunities that international students on H4 and F1
            status are actually eligible for.
          </p>
        </div>

        <div>
          <p className="label text-ink-faint mb-4">Sections</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/index-of-opportunities" className="link-draw">
                The index
              </Link>
            </li>
            <li>
              <Link href="/matches" className="link-draw">
                Your matches
              </Link>
            </li>
            <li>
              <Link href="/guide" className="link-draw">
                Visa rules
              </Link>
            </li>
            <li>
              <Link href="/saved" className="link-draw">
                Saved
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label text-ink-faint mb-4">Sources</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a
                href="https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw"
              >
                USCIS ↗
              </a>
            </li>
            <li>
              <a
                href="https://studyinthestates.dhs.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw"
              >
                Study in the States ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.ice.gov/sevis"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw"
              >
                SEVP ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pb-10">
        <p className="text-xs text-ink-faint leading-relaxed max-w-2xl rule-t pt-5">
          <span className="label text-flag">Not legal advice</span> — Immigration
          rules change and individual circumstances vary. Confirm your
          eligibility with your school&apos;s DSO or a licensed immigration
          attorney before accepting any position, paid or unpaid.
        </p>
      </div>
    </footer>
  );
}
