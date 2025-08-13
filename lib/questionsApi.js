// lib/questionsApi.js
import getBaseUrl from "./getBaseUrl";

const BASE = `${getBaseUrl()}/questions`;

export async function fetchAllQuestions(signal) {
  const res = await fetch(BASE, { signal, cache: "no-store" });
  let data = [];
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) throw new Error(`Failed to load questions: ${res.status}`);
  return Array.isArray(data) ? data.slice().reverse() : [];
}

export async function createQuestion({ title, userId, name }, signal) {
  const res = await fetch(`${BASE}/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, userId, name }),
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to submit question");
  return data;
}
