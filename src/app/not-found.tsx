import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-20 pb-32">
      <p className="label text-ink-faint mb-6">404</p>
      <h1 className="display text-[3rem] sm:text-[4.5rem] max-w-[14ch] mb-6">
        That entry isn&apos;t here.
      </h1>
      <p className="text-ink-soft max-w-lg leading-relaxed mb-10">
        Live listings expire when the employer closes them, so a saved or shared
        link can outlast the posting behind it. The index itself is still
        current.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/index-of-opportunities" className="btn">
          Browse the index
        </Link>
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
