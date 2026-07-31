"use client";

import { toggleSaved, useIsSaved } from "@/lib/saved";

export function SaveButton({ id }: { id: string }) {
  const saved = useIsSaved(id);

  return (
    <button
      onClick={() => toggleSaved(id)}
      className={`label transition-colors ${
        saved ? "text-accent" : "text-ink-faint hover:text-ink"
      }`}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save this opportunity"}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}
