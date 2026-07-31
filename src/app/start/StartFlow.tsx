"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { saveProfile } from "@/lib/profile";
import { FIELDS, FIELD_LABELS, type Field, type VisaTrack } from "@/lib/types";

const TRACK_COPY: Record<
  VisaTrack,
  { label: string; sub: string; note: string }
> = {
  h4: {
    label: "H4 dependent",
    sub: "High school",
    note: "No work authorization. We'll only show unpaid research, volunteering, competitions and skill-building.",
  },
  f1: {
    label: "F1 student",
    sub: "College / university",
    note: "CPT and OPT eligible. We'll prioritise employers that actually sponsor, and cap-exempt institutions.",
  },
};

export function StartFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const initialTrack = params.get("track");
  const [track, setTrack] = useState<VisaTrack | null>(
    initialTrack === "h4" || initialTrack === "f1" ? initialTrack : null,
  );
  const [fields, setFields] = useState<Field[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
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
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      {/* progress */}
      <div className="flex items-center gap-3 mb-14">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              n <= step ? "bg-cyan-glow" : "bg-white/10"
            }`}
          />
        ))}
        <span className="font-mono text-xs text-faint ml-2">{step}/3</span>
      </div>

      {step === 1 && (
        <div className="rise">
          <p className="eyebrow mb-6">Step one</p>
          <h1 className="display text-5xl sm:text-6xl mb-4">
            What&apos;s your status?
          </h1>
          <p className="text-mist mb-12 max-w-lg leading-relaxed">
            This is a legal boundary, not a preference — it determines what
            you&apos;re permitted to accept.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {(["h4", "f1"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTrack(t);
                  setStep(2);
                }}
                className="glass glass-hover edge-glow rounded-2xl p-8 text-left"
              >
                <p className="eyebrow mb-3">{TRACK_COPY[t].sub}</p>
                <h2 className="font-display text-3xl mb-4">
                  {TRACK_COPY[t].label}
                </h2>
                <p className="text-sm text-mist leading-relaxed">
                  {TRACK_COPY[t].note}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && track && (
        <div className="rise">
          <p className="eyebrow mb-6">Step two</p>
          <h1 className="display text-5xl sm:text-6xl mb-4">
            {track === "f1" ? "What's your major?" : "What pulls you in?"}
          </h1>
          <p className="text-mist mb-12 max-w-lg leading-relaxed">
            {track === "f1"
              ? "Pick your field of study, plus anything adjacent you'd consider."
              : "Pick the subjects you'd genuinely spend a Saturday on. Choose as many as you like."}
          </p>

          <div className="flex flex-wrap gap-2.5 mb-12">
            {FIELDS.map((f) => {
              const on = fields.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleField(f)}
                  className={`px-4 py-2.5 rounded-full border text-sm transition-all ${
                    on
                      ? "bg-bone text-void border-bone"
                      : "border-white/15 text-mist hover:border-white/35 hover:text-bone"
                  }`}
                >
                  {FIELD_LABELS[f]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-full border border-white/15 text-mist hover:text-bone transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={fields.length === 0}
              className="px-7 py-3 rounded-full bg-bone text-void font-medium disabled:opacity-25 disabled:cursor-not-allowed hover:bg-white transition-all"
            >
              Continue
            </button>
            {fields.length === 0 && (
              <span className="text-xs text-faint">Pick at least one</span>
            )}
          </div>
        </div>
      )}

      {step === 3 && track && (
        <div className="rise">
          <p className="eyebrow mb-6">Step three</p>
          <h1 className="display text-5xl sm:text-6xl mb-4">
            Any location limits?
          </h1>
          <p className="text-mist mb-12 max-w-lg leading-relaxed">
            Remote-friendly matters a lot if you can&apos;t relocate or drive
            yourself to a lab every week.
          </p>

          <div className="flex flex-col gap-3 mb-12">
            {[
              { v: false, t: "Anywhere is fine", d: "Show me everything" },
              {
                v: true,
                t: "Remote only",
                d: "I need to participate from home",
              },
            ].map((opt) => (
              <button
                key={String(opt.v)}
                onClick={() => setRemoteOnly(opt.v)}
                className={`glass rounded-2xl p-6 text-left border transition-all ${
                  remoteOnly === opt.v
                    ? "border-cyan-glow/50 bg-cyan-glow/5"
                    : "border-white/8 hover:border-white/20"
                }`}
              >
                <div className="font-display text-2xl mb-1">{opt.t}</div>
                <div className="text-sm text-mist">{opt.d}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-full border border-white/15 text-mist hover:text-bone transition-colors"
            >
              Back
            </button>
            <button
              onClick={finish}
              className="px-7 py-3 rounded-full bg-bone text-void font-medium hover:bg-white transition-all hover:scale-[1.03]"
            >
              Show my matches →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
