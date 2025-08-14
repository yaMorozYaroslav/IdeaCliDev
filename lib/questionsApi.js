// lib/questionsApi.js
import getBaseUrl from "./getBaseUrl";

const BASE = `${getBaseUrl()}/questions`;

const safeJson = async (res) => {
  try { return await res.json(); } catch { return null; }
};

const withTimeoutSignal = (signal, ms = 15000) => {
  if (!ms) return signal || undefined;
  const ctrl = new AbortController();
  const timer = setTimeout(
    () => ctrl.abort(new DOMException("Request timed out", "TimeoutError")),
    ms
  );
  const clear = () => clearTimeout(timer);

  if (signal) {
    if (signal.aborted) ctrl.abort(signal.reason);
    else signal.addEventListener("abort", () => ctrl.abort(signal.reason), { once: true });
  }
  // attach a cleanup handle
  ctrl.signal._clear = clear;
  return ctrl.signal;
};

async function apiRequest(path, { method = "GET", headers, body, signal, timeoutMs = 15000, cache = "no-store" } = {}) {
  const sig = withTimeoutSignal(signal, timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, { method, headers, body, signal: sig, cache });
    const data = await safeJson(res);
    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  } finally {
    if (sig && typeof sig._clear === "function") sig._clear();
  }
}

export async function fetchAllQuestions(signal, { timeoutMs = 15000 } = {}) {
  const data = await apiRequest("", { signal, timeoutMs, cache: "no-store" });
  if (Array.isArray(data)) {
    // If backend sends createdAt, sort newest first; else keep your old reverse
    if (data.length && data[0]?.createdAt) {
      return data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return data.slice().reverse();
  }
  return [];
}

export async function createQuestion({ title, userId, name }, signal, { timeoutMs = 15000 } = {}) {
  const payload = {
    title: String(title ?? "").trim(),
    userId: userId ?? null,
    name: name ?? "Anonymous",
  };
  if (!payload.title) throw new Error("Question cannot be empty");
  if (payload.title.length > 500) payload.title = payload.title.slice(0, 500);

  const data = await apiRequest("/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
    timeoutMs,
  });
  return data || {};
}
