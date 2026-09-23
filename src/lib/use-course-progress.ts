"use client";

import * as React from "react";
import type { Course } from "@/data/courses";

export type ToggleEvent = {
  /** Increments on every toggle, so consumers can tell one click from the next. */
  seq: number;
  id: string;
  becameDone: boolean;
  moduleCompleted: boolean;
  courseCompleted: boolean;
};

const keyFor = (slug: string) => `progress:${slug}`;

// In-memory mirror of localStorage so progress still works when storage is unavailable.
const cache = new Map<string, string>();
const listeners = new Set<() => void>();

function readRaw(key: string): string {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  let raw = "";
  try {
    raw = window.localStorage.getItem(key) ?? "";
  } catch {}
  cache.set(key, raw);
  return raw;
}

function writeRaw(key: string, raw: string) {
  cache.set(key, raw);
  try {
    window.localStorage.setItem(key, raw);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key) cache.delete(e.key);
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const subscribeNever = () => () => {};

function parse(raw: string): ReadonlySet<string> {
  try {
    const value: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(value)) {
      return new Set(value.filter((v): v is string => typeof v === "string"));
    }
  } catch {}
  return new Set();
}

/**
 * Lesson completion for one course, persisted in localStorage.
 * `hydrated` is false on the server and during hydration; the saved state
 * only appears once it flips, so the markup matches on first render.
 */
export function useCourseProgress(course: Course | undefined) {
  const slug = course?.slug ?? "";
  const hydrated = React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const raw = React.useSyncExternalStore(
    subscribe,
    () => readRaw(keyFor(slug)),
    () => "",
  );
  const done = React.useMemo(() => parse(raw), [raw]);
  const [event, setEvent] = React.useState<ToggleEvent | null>(null);

  const toggle = React.useCallback(
    (id: string): ToggleEvent | null => {
      if (!course) return null;
      const becameDone = !done.has(id);
      const next = new Set(done);
      if (becameDone) next.add(id);
      else next.delete(id);
      writeRaw(keyFor(slug), JSON.stringify([...next]));

      const owner = course.modules.find((m) =>
        m.lessons.some((l) => l.id === id),
      );
      const moduleCompleted =
        becameDone && !!owner?.lessons.every((l) => next.has(l.id));
      const courseCompleted =
        becameDone &&
        course.modules.every((m) => m.lessons.every((l) => next.has(l.id)));
      const result: ToggleEvent = {
        seq: (event?.seq ?? 0) + 1,
        id,
        becameDone,
        moduleCompleted,
        courseCompleted,
      };
      setEvent(result);
      return result;
    },
    [course, slug, done, event],
  );

  return { done, hydrated, toggle, event };
}
