"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { loadProfile, saveProfile } from "@/lib/profile";
import { FIELDS, FIELD_LABELS, type Field, type VisaTrack } from "@/lib/types";

const TRACK_COPY: Record<
  VisaTrack,
  { label: string; sub: string; note: string }
> = {
  h4: {
    label: "H4 dependent",
    sub: "High school",
    note: "No work authorization. You'll see unpaid research, volunteering, competitions and skill-building — and nothing you could be penalised for accepting.",
  },
  f1: {
    label: "F1 student",
    sub: "College or university",
    note: "CPT and OPT eligible. You'll see internships and research, with cap-exempt institutions ranked first because they skip the H-1B lottery.",
  },
};

const STEPS = ["Status", "Subjects", "Location"];

export function StartFlow() {
  const router = useRouter();
  const params = useSearchParams();

  // Re-entering from "Edit" should prefill rather than start from blank.
  const existing = typeof window !== "undefined" ? loadProfile() : null;
  const fromUrl = params.get("track");
  const initialTrack =
    fromUrl === "h4" || fromUrl === "f1" ? fromUrl : (existing?.track ?? null);

  const [track, setTrack] = useState<VisaTrack | null>(initialTrack);
  const [fields, setFields] = useState<Field[]>(existing?.fields ?? []);
  const [remoteOnly, setRemoteOnly] = useState(existing?.remoteOnly ?? false);
  const [step, setStep] = useState(initialTrack ? 2 : 1);

  function toggleField(f: Field) {
    setFields((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  }

  function finish() {
    if (!track) return;
    saveProfile({
      track,
      fields,
      remoteOnly,
      createdAt: new Date().toISOString(),
    });
    router.push("/matches");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-14 pb-28">
      {/* Step rail */}
      <ol className="flex items-stretch gap-px bg-rule mb-14">
        {STEPS.map((s, i) => {
          const n = i + 1;
          return (
            <li
              key={s}
              className={`flex-1 bg-paper px-3 py-3 ${n <= step ? "" : "opacity-40"}`}
            >
              <div
                className={`h-0.5 mb-3 ${n <= step ? "bg-ink" : "bg-rule"}`}
              />
              <span className="label text-ink-faint">
                {String(n).padStart(2, "0")}
              </span>
              <span className="label text-ink ml-2">{s}</span>
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <div>
          <h1 className="display text-[2.8rem] sm:text-[4rem] mb-5 max-w-[14ch]">
            What is your status?
          </h1>
          <p className="text-ink-soft mb-12 max-w-lg leading-relaxed">
            This is a legal boundary, not a preference. It decides what you are
            permitted to accept, so everything downstream depends on it.
          </p>

          <div className="grid sm:grid-cols-2 gap-px bg-rule">
            {(["h4", "f1"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTrack(t);
                  setStep(2);
                }}
                className="bg-paper hover:bg-paper-raised transition-colors p-8 text-left group"
              >
                <div
                  className={`h-1 w-12 mb-6 ${t === "h4" ? "bar-h4" : "bar-f1"}`}
                />
                <p className="label text-ink-faint mb-3">{TRACK_COPY[t].sub}</p>
                <h2 className="display-tight text-3xl mb-4">
                  {TRACK_COPY[t].label}
                </h2>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {TRACK_COPY[t].note}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && track && (
        <div>
          <h1 className="display text-[2.8rem] sm:text-[4rem] mb-5 max-w-[16ch]">
            {track === "f1" ? "What do you study?" : "What pulls you in?"}
          </h1>
          <p className="text-ink-soft mb-12 max-w-lg leading-relaxed">
            {track === "f1"
              ? "Your field of study, plus anything adjacent you would genuinely consider."
              : "The subjects you would spend a free Saturday on. Pick as many as apply — a wider net finds more."}
          </p>

          <div className="flex flex-wrap gap-2 mb-12">
            {FIELDS.map((f) => (
              <button
                key={f}
                className="chip"
                data-on={fields.includes(f)}
                onClick={() => toggleField(f)}
              >
                {FIELD_LABELS[f]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 rule-t pt-6">
            <button onClick={() => setStep(1)} className="btn btn-ghost">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={fields.length === 0}
              className="btn disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
            </button>
            <span className="label text-ink-faint">
              {fields.length === 0
                ? "Pick at least one"
                : `${fields.length} selected`}
            </span>
          </div>
        </div>
      )}

      {step === 3 && track && (
        <div>
          <h1 className="display text-[2.8rem] sm:text-[4rem] mb-5 max-w-[14ch]">
            Can you travel to it?
          </h1>
          <p className="text-ink-soft mb-12 max-w-lg leading-relaxed">
            Remote-only is treated as a hard filter, not a preference — so
            choose it only if you genuinely cannot attend in person. A lot of
            the strongest research happens on campus.
          </p>

          <div className="grid gap-px bg-rule mb-12">
            {[
              {
                v: false,
                t: "Anywhere is fine",
                d: "Show on-site programs as well as remote ones",
              },
              {
                v: true,
                t: "Remote only",
                d: "Hide anything I would have to attend in person",
              },
            ].map((opt) => (
              <button
                key={String(opt.v)}
                onClick={() => setRemoteOnly(opt.v)}
                className={`p-7 text-left transition-colors ${
                  remoteOnly === opt.v
                    ? "bg-ink text-paper"
                    : "bg-paper hover:bg-paper-raised"
                }`}
              >
                <div className="display-tight text-2xl mb-1">{opt.t}</div>
                <div
                  className={`text-sm ${remoteOnly === opt.v ? "opacity-70" : "text-ink-soft"}`}
                >
                  {opt.d}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 rule-t pt-6">
            <button onClick={() => setStep(2)} className="btn btn-ghost">
              Back
            </button>
            <button onClick={finish} className="btn">
              Show my matches →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
