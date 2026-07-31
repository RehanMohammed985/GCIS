"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-20 pb-32">
      <p className="label text-accent mb-6">Something broke</p>
      <h1 className="display text-[3rem] sm:text-[4.5rem] max-w-[14ch] mb-6">
        This page didn&apos;t load.
      </h1>
      <p className="text-ink-soft max-w-lg leading-relaxed mb-10">
        The index pulls from external job feeds, and one of them may be
        unreachable right now. Trying again usually resolves it.
      </p>
      <button onClick={reset} className="btn">
        Try again
      </button>
      {error.digest && (
        <p className="label text-ink-faint mt-8">Ref {error.digest}</p>
      )}
    </div>
  );
}
