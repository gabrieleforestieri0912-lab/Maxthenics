"use client";

import { safeJsonParse } from "./safeJson";

function key(programId: number | string): string {
  return `maxthenics-progress-${programId}`;
}

/** Completed lesson ids for a program. */
export function getLessonProgress(programId: number | string): Set<string> {
  if (typeof window === "undefined") return new Set();
  const arr = safeJsonParse<string[]>(window.localStorage.getItem(key(programId)), []);
  return new Set(Array.isArray(arr) ? arr : []);
}

function saveLessonProgress(programId: number | string, done: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(programId), JSON.stringify([...done]));
  } catch {
    /* storage unavailable */
  }
}

/** Toggle one lesson; returns the updated set. */
export function toggleLessonProgress(programId: number | string, lessonId: string): Set<string> {
  const done = getLessonProgress(programId);
  if (done.has(lessonId)) {
    done.delete(lessonId);
  } else {
    done.add(lessonId);
  }
  saveLessonProgress(programId, done);
  return done;
}
