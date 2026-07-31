"use client";

import { useSyncExternalStore } from "react";

const KEY = "gcis.saved.v1";
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

// Snapshots are compared by identity, so re-parsing on every read would loop.
// Cache against the raw string and only rebuild when the text changes.
let cachedRaw: string | null = null;
let cachedIds: string[] = [];
let primed = false;

function getSnapshot(): string[] {
  const raw = window.localStorage.getItem(KEY);
  if (!primed || raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = read();
    primed = true;
  }
  return cachedIds;
}

const EMPTY: string[] = [];

export function toggleSaved(id: string) {
  const next = read().includes(id)
    ? read().filter((x) => x !== id)
    : [...read(), id];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

export function useSavedIds(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function useIsSaved(id: string): boolean {
  return useSavedIds().includes(id);
}

export function useSavedCount(): number {
  return useSavedIds().length;
}
