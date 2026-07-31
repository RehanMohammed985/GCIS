import { Suspense } from "react";
import { StartFlow } from "./StartFlow";

export const metadata = {
  title: "Build your profile — GCIS",
};

export default function StartPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-6 py-32">
          <p className="eyebrow shimmer">Loading…</p>
        </div>
      }
    >
      <StartFlow />
    </Suspense>
  );
}
