// lib/decodeUserForCookies.js
// Purpose: decode (not verify) an access token to build a lightweight UI cookie.
// Use ONLY for non-sensitive UI state like name/avatar/unansweredCount.
// Never use this to authorize actions — the backend must enforce auth.

function base64urlDecode(str) {
  if (typeof str !== "string") return "";
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
  return Buffer.from(b64 + pad, "base64").toString("utf8");
}

function decodePayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = base64urlDecode(parts[1]);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isExpired(claims, skewSec = 30) {
  const exp = typeof claims?.exp === "number" ? claims.exp : null;
  if (!exp) return false; // no exp -> don't block UI cookie, backend still guards real actions
  const now = Math.floor(Date.now() / 1000);
  return exp + skewSec < now;
}

/**
 * Decodes user-like fields from a JWT access token payload (no signature verify).
 * @param {string} token
 * @returns {object|null} { userId, email, name, picture, status, unansweredCount }
 */
export function decodeUserForCookies(token) {
  const claims = decodePayload(token);
  if (!claims) return null;
  if (isExpired(claims)) return null;

  // Accept multiple id shapes
  const id = claims.userId || claims.googleId || claims.sub || null;
  if (!id) return null;

  const unansweredCount =
    typeof claims.unansweredCount === "number"
      ? claims.unansweredCount
      : Array.isArray(claims.unanswered)
      ? claims.unanswered.length
      : 0;

  return {
    userId: id,
    email: claims.email || null,
    name: claims.name || claims.given_name || null,
    picture: claims.picture || null,
    status: claims.status || null,
    unansweredCount,
  };
}
