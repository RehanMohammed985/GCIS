"use client";

import { useSyncExternalStore } from "react";
import type { Profile } from "./types";

const KEY = "gcis.profile.v1";

function parse(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Profile;
    // Guard against a half-written or older-shape profile wedging the app.
    if (!parsed.track || !Array.isArray(parsed.fields)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  return parse(window.localStorage.getItem(KEY));
}

/* --- external store plumbing -------------------------------------------- */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other tabs in sync too — localStorage is shared across them.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// useSyncExternalStore compares snapshots by identity, so re-parsing on every
// read would loop forever. Cache the parsed object against the raw string and
// only rebuild it when the underlying text actually changes.
let cachedRaw: string | null = null;
let cachedProfile: Profile | null = null;
let primed = false;

function getSnapshot(): Profile | null {
  const raw = window.localStorage.getItem(KEY);
  if (!primed || raw !== cachedRaw) {
    cachedRaw = raw;
    cachedProfile = parse(raw);
    primed = true;
  }
  return cachedProfile;
}

export function saveProfile(profile: Profile) {
  window.localStorage.setItem(KEY, JSON.stringify(profile));
  emit();
}

export function clearProfile() {
  window.localStorage.removeItem(KEY);
  emit();
}

/**
 * Reads the stored profile.
 *
 * `ready` distinguishes "still hydrating" from "definitely no profile" —
 * without it the matches page flashes its empty state on every load. It is false
 * during server render and hydration, then true, which is exactly the
 * server/client split useSyncExternalStore already models.
 */
export function useProfile() {
  const profile = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return { profile, ready };
}
